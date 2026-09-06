#!/usr/bin/env node
/**
 * Pisgah build guardrails.
 *
 * Three rules that are cheaper to enforce than to remember. Wire this into CI
 * and into the pre-commit hook:
 *
 *   "prebuild": "node scripts/guardrails.mjs"
 *
 * 1. No Bahraini phone literal outside src/config/siteConfig.ts
 * 2. No price, rate or currency anywhere in the application
 * 3. No em dash or en dash in any source file, in any language
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const CONFIG_FILE = join('src', 'config', 'siteConfig.ts');

const EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.mdx', '.json']);

const RULES = [
  {
    id: 'no-phone-literal',
    // +973 or 973 followed by eight digits, with optional spaces or hyphens.
    pattern: /(?:\+?973[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{3})/g,
    message: 'Bahraini phone literal found. Import it from siteConfig instead.',
    allow: (file) => file === CONFIG_FILE,
  },
  {
    id: 'no-pricing',
    pattern: /\b(?:BHD|BD)\s?\d|\bدينار\b|\/\s?hr\b|\bper hour\b|\bstarting at\b|\bfrom BHD\b/gi,
    message: 'Pricing found. This site quotes only after an on-site survey.',
    allow: () => false,
  },
  {
    id: 'no-long-dashes',
    pattern: /[‒–—―]/g,
    message: 'Em dash or en dash found. Use a standard hyphen.',
    allow: () => false,
  },
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
      continue;
    }
    const dot = entry.lastIndexOf('.');
    if (dot > -1 && EXTENSIONS.has(entry.slice(dot))) files.push(full);
  }
  return files;
}

let failures = 0;

for (const file of walk(SRC)) {
  const rel = relative(ROOT, file).split(sep).join(sep);
  const source = readFileSync(file, 'utf8');
  const lines = source.split('\n');

  for (const rule of RULES) {
    if (rule.allow(rel)) continue;
    lines.forEach((line, index) => {
      rule.pattern.lastIndex = 0;
      const match = rule.pattern.exec(line);
      if (!match) return;
      failures += 1;
      console.error(
        `${rel}:${index + 1}  [${rule.id}]  ${rule.message}\n    ${line.trim().slice(0, 120)}`,
      );
    });
  }
}

if (failures > 0) {
  console.error(`\nGuardrails failed with ${failures} violation(s).`);
  process.exit(1);
}

console.log('Guardrails passed. No phone literals, no pricing, no long dashes.');
