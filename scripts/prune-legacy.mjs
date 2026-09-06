#!/usr/bin/env node
/**
 * Prune retired files.
 *
 * Unpacking a release zip over a checkout adds and overwrites, but it never
 * deletes. A component removed in a later version therefore survives in the
 * repository and breaks the build against the newer dictionary.
 *
 * This deletes files this project has explicitly retired, and nothing else.
 * The list below is an allowlist: a path is only removed if it appears here.
 * Nothing is matched by glob or pattern, so the script cannot delete a file
 * that was not deliberately named.
 *
 * Runs first in `prebuild`, so a stale checkout heals itself. Committing the
 * deletions is still the correct fix, and the script prints the git command.
 */

import { existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

/** Retired in the version noted. Never add a pattern here, only exact paths. */
const RETIRED = [
  // v5: the sticky bottom action bar was removed from the design
  'src/components/layout/MobilePinnedBar.tsx',

  // v5: placeholder imagery replaced by client photography
  'public/media/hero-wide.jpg',
  'public/media/hero-technician.jpg',
  'public/media/journey-survey.jpg',
  'public/media/journey-mobilisation.jpg',
  'public/media/journey-signoff.jpg',
];

const removed = [];

for (const relative of RETIRED) {
  const full = join(ROOT, relative);
  if (!existsSync(full)) continue;
  unlinkSync(full);
  removed.push(relative);
}

if (removed.length === 0) {
  console.log('Prune: nothing retired is present. Tree is current.');
  process.exit(0);
}

console.log(`Prune: removed ${removed.length} retired file(s) from this checkout:`);
for (const path of removed) console.log(`  - ${path}`);
console.log('\nCommit the deletion so the repository matches:');
console.log(`  git rm -r --cached --ignore-unmatch ${removed.join(' ')}`);
console.log('  git commit -m "Remove files retired in v5"');
