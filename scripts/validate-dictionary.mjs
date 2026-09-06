#!/usr/bin/env node
/**
 * Dictionary and asset validator.
 *
 * This catches the exact class of failure that broke a Vercel build:
 * a component referencing `t.something.that.no.longer.exists` after a key was
 * renamed or removed. TypeScript catches it too, but only once dependencies are
 * installed. This runs with zero dependencies, in about a second, so it can sit
 * in `prebuild` and in a pre-commit hook.
 *
 * Five checks:
 *   1. Every `t.<path>` used in a component resolves to a real key in en.ts
 *   2. en.ts and ar.ts have identical key trees, including array lengths
 *   3. Every `siteConfig.<path>` used in a component resolves
 *   4. Every /media/... asset referenced in source exists on disk
 *   5. No source file imports a module that is not present on disk
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, dirname, resolve } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

let failures = 0;
const fail = (msg) => {
  console.error(`  FAIL  ${msg}`);
  failures += 1;
};

/* ------------------------------------------------------------------ */
/* Load a plain object literal out of a TypeScript module.             */
/* Both dictionaries and siteConfig are literals with no computed      */
/* values, so a narrow strip and evaluate is safe and exact.           */
/* ------------------------------------------------------------------ */
function loadLiteral(file, exportName) {
  const source = readFileSync(file, 'utf8');
  const startMarker = new RegExp(`export const ${exportName}[^=]*=\\s*\\{`);
  const match = startMarker.exec(source);
  if (!match) throw new Error(`Could not find "export const ${exportName}" in ${file}`);

  const openIndex = source.indexOf('{', match.index);
  let depth = 0;
  let end = -1;
  let inString = null;
  let escaped = false;

  for (let i = openIndex; i < source.length; i += 1) {
    const char = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === inString) inString = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      inString = char;
      continue;
    }
    if (char === '/' && source[i + 1] === '/') {
      i = source.indexOf('\n', i);
      if (i === -1) break;
      continue;
    }
    if (char === '/' && source[i + 1] === '*') {
      i = source.indexOf('*/', i) + 1;
      continue;
    }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) throw new Error(`Unbalanced braces in ${file}`);

  const literal = source
    .slice(openIndex, end)
    /* Type assertions and satisfies clauses carry no runtime value. */
    .replace(/\s+satisfies\s+[A-Za-z_][\w.<>[\]|'" ]*/g, '')
    .replace(/\s+as\s+const\b/g, '')
    .replace(/\s+as\s+readonly\s+[A-Za-z_][\w.<>[\]]*/g, '')
    .replace(/\s+as\s+[A-Za-z_][\w.<>[\]]*(\[\])?/g, '')
    .replace(/\s+as\s+'[^']*'(\s*\|\s*'[^']*')*/g, '');

  // eslint-disable-next-line no-new-func
  return new Function(`return (${literal});`)();
}

function resolvePath(object, path) {
  return path.split('.').reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined;
    return acc[key];
  }, object);
}

/* Flatten to a comparable shape: dotted path -> "object" | "array:N" | "leaf" */
function shapeOf(value, prefix, out) {
  if (Array.isArray(value)) {
    out.set(prefix, `array:${value.length}`);
    return out;
  }
  if (value && typeof value === 'object') {
    out.set(prefix, 'object');
    for (const key of Object.keys(value)) {
      shapeOf(value[key], prefix ? `${prefix}.${key}` : key, out);
    }
    return out;
  }
  out.set(prefix, 'leaf');
  return out;
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
      continue;
    }
    if (/\.(ts|tsx)$/.test(entry)) files.push(full);
  }
  return files;
}

/* ------------------------------------------------------------------ */
console.log('Validating dictionaries and assets\n');

const en = loadLiteral(join(SRC, 'locales/en.ts'), 'en');
const ar = loadLiteral(join(SRC, 'locales/ar.ts'), 'ar');
const config = loadLiteral(join(SRC, 'config/siteConfig.ts'), 'siteConfig');

const files = walk(SRC);

/* --- 1. every t.<path> resolves ----------------------------------- */
const T_PATH = /\bt\.((?:[A-Za-z_$][\w$]*)(?:\.[A-Za-z_$][\w$]*)*)/g;
let tChecked = 0;

for (const file of files) {
  const rel = relative(ROOT, file);
  const source = readFileSync(file, 'utf8');
  if (!/\buseLocale\b/.test(source)) continue;

  for (const match of source.matchAll(T_PATH)) {
    const path = match[1];
    /* Skip the final segment when it is clearly a bracket lookup base,
       for example t.nav[link.key]: the base t.nav still has to exist. */
    const value = resolvePath(en, path);
    tChecked += 1;
    if (value === undefined) {
      const line = source.slice(0, match.index).split('\n').length;
      fail(`${rel}:${line}  t.${path} does not exist in en.ts`);
    }
  }
}
console.log(`  1. dictionary references resolved: ${tChecked}`);

/* --- 2. en and ar have identical key trees ------------------------ */
const enShape = shapeOf(en, '', new Map());
const arShape = shapeOf(ar, '', new Map());

for (const [path, kind] of enShape) {
  if (!arShape.has(path)) fail(`ar.ts is missing "${path}"`);
  else if (arShape.get(path) !== kind) {
    fail(`"${path}" is ${kind} in en.ts but ${arShape.get(path)} in ar.ts`);
  }
}
for (const path of arShape.keys()) {
  if (!enShape.has(path)) fail(`ar.ts has an extra key "${path}" that en.ts does not define`);
}
console.log(`  2. locale key parity: ${enShape.size} nodes in en, ${arShape.size} in ar`);

/* --- 3. every siteConfig.<path> resolves --------------------------- */
const CONFIG_PATH = /\bsiteConfig\.((?:[A-Za-z_$][\w$]*)(?:\.[A-Za-z_$][\w$]*)*)/g;
let cChecked = 0;

for (const file of files) {
  const rel = relative(ROOT, file);
  if (rel.endsWith('siteConfig.ts')) continue;
  const source = readFileSync(file, 'utf8');

  for (const match of source.matchAll(CONFIG_PATH)) {
    const path = match[1];
    cChecked += 1;
    if (resolvePath(config, path) === undefined) {
      const line = source.slice(0, match.index).split('\n').length;
      fail(`${rel}:${line}  siteConfig.${path} does not exist`);
    }
  }
}
console.log(`  3. siteConfig references resolved: ${cChecked}`);

/* --- 4. every /media asset referenced exists ----------------------- */
const MEDIA = /['"`](\/media\/[A-Za-z0-9._-]+)['"`]/g;
const seen = new Set();

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(MEDIA)) {
    const asset = match[1];
    if (seen.has(asset)) continue;
    seen.add(asset);
    if (!existsSync(join(ROOT, 'public', asset))) {
      fail(`${relative(ROOT, file)}  references ${asset}, which is not in public/media`);
    }
  }
}
console.log(`  4. media assets referenced and present: ${seen.size}`);

/* --- 5. no import points at a file that does not exist ------------- */
const IMPORT = /from\s+['"](\.[^'"]+|@\/[^'"]+)['"]/g;
let iChecked = 0;

for (const file of files) {
  const rel = relative(ROOT, file);
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(IMPORT)) {
    const spec = match[1];
    const base = spec.startsWith('@/') ? join(SRC, spec.slice(2)) : resolve(dirname(file), spec);
    const candidates = [
      base,
      `${base}.ts`,
      `${base}.tsx`,
      join(base, 'index.ts'),
      join(base, 'index.tsx'),
    ];
    iChecked += 1;
    if (!candidates.some((candidate) => existsSync(candidate))) {
      const line = source.slice(0, match.index).split('\n').length;
      fail(`${rel}:${line}  imports "${spec}", which does not exist on disk`);
    }
  }
}
console.log(`  5. local imports resolved: ${iChecked}`);

/* ------------------------------------------------------------------ */
if (failures > 0) {
  console.error(`\nValidation failed with ${failures} problem(s).`);
  process.exit(1);
}
console.log('\nValidation passed. Dictionaries, config, assets and imports all resolve.');
