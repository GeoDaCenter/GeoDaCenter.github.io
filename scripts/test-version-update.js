#!/usr/bin/env node

/**
 * Dry-run simulation of the version update process.
 * Fetches the real release assets and shows exactly what would change,
 * without modifying any files.
 *
 * Usage:
 *   node scripts/test-version-update.js <version> [date]
 *   node scripts/test-version-update.js 1.22.1 8/26/2026
 */

const { run } = require('./update-version.js');

const version = process.argv[2];
const date = process.argv[3] || new Date().toLocaleDateString('en-US', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric'
});

if (!version) {
  console.error('Usage: node scripts/test-version-update.js <version> [date]');
  console.error('Example: node scripts/test-version-update.js 1.22.1 8/26/2026');
  process.exit(1);
}

run({ version, date, dryRun: true }).catch((error) => {
  console.error(`💥 ${error.message}`);
  process.exit(1);
});
