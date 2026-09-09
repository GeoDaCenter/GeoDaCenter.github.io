#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * GeoDa version update script
 *
 * Updates all download/announcement files when a new GeoDa version is released.
 * Unlike the old script, it does NOT guess download URLs by rewriting the
 * version in existing links. Instead it fetches the actual release assets from
 * the GeoDa GitHub repo and builds the download entries from the real file
 * names, so links can never silently point at non-existent files.
 *
 * Supports both version schemes:
 *   - major.minor.patch      (e.g. 1.22.1)
 *   - major.minor.patch.build (e.g. 1.22.0.21)
 *
 * Usage:
 *   node scripts/update-version.js <version> [date]
 *   node scripts/update-version.js 1.22.1 8/26/2026
 *   node scripts/update-version.js 1.22.1            (uses current date)
 *
 * Set GITHUB_TOKEN to authenticate the GitHub API call (avoids rate limits).
 */

const VERSION_RE = /^[0-9]+\.[0-9]+\.[0-9]+(\.[0-9]+)?$/;
const DATE_RE = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;

const LANGUAGES = ['de', 'es', 'zh-Hans'];

const RELEASE_REPO = 'GeoDaCenter/geoda';

/**
 * Per-platform matchers. Each matcher:
 *  - pattern:  regex tested against the release asset file name
 *  - text:     (version, date) => display text for the download button
 *  - tracking: (family) => GA4 tracking object; family = { name: "1.22", code: "122" }
 */
const PLATFORM_MATCHERS = {
  downloadLinux: [
    {
      pattern: /GeoDa-[\d.]+-x86_64\.AppImage$/,
      text: (v, d) => `GeoDa ${v} (${d}) AppImage for 64-bit Linux`,
      tracking: (f) => ({ category: `GeoDaUbuntu64Downloads${f.code}`, label: 'GeoDa Software Downloads Count for Ubuntu 64' })
    }
  ],
  downloadMac: [
    {
      pattern: /GeoDa[\d.]+-arm64-Installer\.dmg$/,
      text: (v, d) => `GeoDa ${v} (${d}) for Mac OS X (Ventura+) [Apple Silicon Arm64]`,
      tracking: (f) => ({ category: `GeoDaOSXDownloads${f.code}`, label: `GeoDa Software Downloads Count for MacOSX ${f.name}` })
    },
    {
      pattern: /GeoDa[\d.]+-x86_64-Installer\.dmg$/,
      text: (v, d) => `GeoDa ${v} (${d}) for Mac OS X (Big Sur+) [Apple Intel X86_64]`,
      tracking: (f) => ({ category: `GeoDaOSXDownloads${f.code}`, label: `GeoDa Software Downloads Count for MacOSX ${f.name}` })
    }
  ],
  downloadWindows: [
    {
      pattern: /GeoDa_[\d.]+_win7\+x64_Setup\.exe$/,
      text: (v, d) => `GeoDa ${v} (${d}) for 64-bit Windows`,
      tracking: (f) => ({ category: `GeoDaWin64Downloads${f.code}`, label: 'GeoDa Software Downloads Count for Win64' })
    },
    {
      pattern: /GeoDa_[\d.]+_win7\+x86_Setup\.exe$/,
      text: (v, d) => `GeoDa ${v} (${d}) for 32-bit Windows`,
      tracking: (f) => ({ category: `GeoDaWin32Downloads${f.code}`, label: 'GeoDa Software Downloads Count for Win32' })
    },
    {
      pattern: /GeoDa_[\d.]+_arm64_Setup\.exe$/,
      text: (v, d) => `GeoDa ${v} (${d}) for ARM64 Windows`,
      tracking: (f) => ({ category: `GeoDaWin64Downloads${f.code}`, label: 'GeoDa Software Downloads Count for Win64' })
    }
  ]
};

/**
 * Description patterns per language (downloadContent.json). The version number
 * in each localized description is replaced with the new version.
 */
const DESC_PATTERNS = {
  '': /GeoDa [0-9]+(\.[0-9]+)+ with new features/,
  de: /GeoDa [0-9]+(\.[0-9]+)+ mit neuen Funktionen/,
  es: /GeoDa [0-9]+(\.[0-9]+)+ con nuevas funciones/,
  'zh-Hans': /GeoDa [0-9]+(\.[0-9]+)+，具有新功能/
};
const DESC_REPLACEMENTS = {
  '': (v) => `GeoDa ${v} with new features`,
  de: (v) => `GeoDa ${v} mit neuen Funktionen`,
  es: (v) => `GeoDa ${v} con nuevas funciones`,
  'zh-Hans': (v) => `GeoDa ${v}，具有新功能`
};

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJson(p, data) { fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n'); }

/** Convert M/D/YYYY to MM/DD/YYYY (used by announcements.json). */
function toMMDDYYYY(date) {
  return date.split('/').map((part, i) => (i < 2 ? part.padStart(2, '0') : part)).join('/');
}

/** Fetch the release assets for v<version> from the GeoDa repo. */
async function fetchReleaseAssets(version) {
  const url = `https://api.github.com/repos/${RELEASE_REPO}/releases/tags/v${version}`;
  const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'GeoDa-website-version-update' };
  if (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch release v${version} from GitHub API (HTTP ${res.status}). ` +
      `Verify the release exists at https://github.com/${RELEASE_REPO}/releases/tag/v${version}`
    );
  }
  const data = await res.json();
  return data.assets || [];
}

/** Build the currentVersion.downloads array for a platform from real assets. */
function buildPlatformDownloads(platform, assets, version, date, family) {
  const matchers = PLATFORM_MATCHERS[platform];
  const entries = [];
  for (const m of matchers) {
    const asset = assets.find((a) => m.pattern.test(a.name));
    if (asset) {
      entries.push({
        text: m.text(version, date),
        href: asset.browser_download_url,
        tracking: m.tracking(family)
      });
    }
  }
  if (entries.length === 0) {
    throw new Error(
      `No matching assets found for ${platform} in release v${version}. ` +
      `Available assets: ${assets.map((a) => a.name).join(', ')}`
    );
  }
  return entries;
}

function updateDownloadContent(data, lang, version, date) {
  data.donation.description = data.donation.description.replace(
    DESC_PATTERNS[lang],
    DESC_REPLACEMENTS[lang](version)
  );
  data.releaseList.releases.unshift({ date, version });
  return data;
}

function updatePlatform(data, newDownloads, version) {
  const oldCurrent = JSON.parse(JSON.stringify(data.currentVersion));
  data.currentVersion = { version: `GeoDa ${version}`, downloads: newDownloads };
  data.previousVersions.unshift(oldCurrent);
  return data;
}

function updateNightly(data, version, date) {
  data.releases.unshift({
    date,
    version: `GeoDa ${version}`,
    releaseNotes: `https://github.com/${RELEASE_REPO}/releases/tag/v${version}`
  });
  return data;
}

function updateAnnouncements(data, version, date) {
  const oldCurrent = data.current;
  data.current = {
    text: `🚀 GeoDa ${version} (${date}) is now available! 🎯`,
    url: '/download',
    date: toMMDDYYYY(date),
    active: true
  };
  data.previous.unshift({ ...oldCurrent, active: false });
  return data;
}

function updateIndexContent(data, version) {
  data.mainContent.announce.text =
    `🚀 NEW RELEASE! GeoDa version ${version} is now available with enhanced features! Download now! 🎯`;
  return data;
}

/**
 * Run the version update.
 * @param {object} opts
 * @param {string} opts.version  new version, e.g. "1.22.1"
 * @param {string} opts.date     release date in M/D/YYYY
 * @param {boolean} [opts.dryRun] print what would change without writing files
 */
async function run({ version, date, dryRun = false }) {
  if (!VERSION_RE.test(version)) {
    throw new Error(`Invalid version format "${version}". Expected X.Y.Z or X.Y.Z.W (e.g. 1.22.1 or 1.22.0.21)`);
  }
  if (!DATE_RE.test(date)) {
    throw new Error(`Invalid date format "${date}". Expected M/D/YYYY (e.g. 8/26/2026)`);
  }

  const [major, minor] = version.split('.');
  const family = { name: `${major}.${minor}`, code: `${major}${minor}` };

  console.log(`🔄 Updating version to: ${version}`);
  console.log(`📅 Using date: ${date}`);
  console.log(`⬇️  Fetching release assets for v${version}...`);

  const assets = await fetchReleaseAssets(version);
  console.log(`   Found ${assets.length} asset(s): ${assets.map((a) => a.name).join(', ')}\n`);

  const linuxDownloads = buildPlatformDownloads('downloadLinux', assets, version, date, family);
  const macDownloads = buildPlatformDownloads('downloadMac', assets, version, date, family);
  const windowsDownloads = buildPlatformDownloads('downloadWindows', assets, version, date, family);

  if (dryRun) {
    console.log('🧪 DRY RUN — no files will be modified\n');
    console.log('New Linux downloads:');
    linuxDownloads.forEach((d) => console.log(`  - ${d.text}\n    ${d.href}`));
    console.log('New Mac downloads:');
    macDownloads.forEach((d) => console.log(`  - ${d.text}\n    ${d.href}`));
    console.log('New Windows downloads:');
    windowsDownloads.forEach((d) => console.log(`  - ${d.text}\n    ${d.href}`));
  }

  // Build the list of files to update: { filePath, data }
  const updates = [];
  const main = 'src/data';
  const add = (filePath, data) => updates.push({ filePath, data });

  add(`${main}/downloadContent.json`, updateDownloadContent(readJson(`${main}/downloadContent.json`), '', version, date));
  add(`${main}/downloadLinux.json`, updatePlatform(readJson(`${main}/downloadLinux.json`), linuxDownloads, version));
  add(`${main}/downloadMac.json`, updatePlatform(readJson(`${main}/downloadMac.json`), macDownloads, version));
  add(`${main}/downloadWindows.json`, updatePlatform(readJson(`${main}/downloadWindows.json`), windowsDownloads, version));
  add(`${main}/downloadNightly.json`, updateNightly(readJson(`${main}/downloadNightly.json`), version, date));
  add(`${main}/announcements.json`, updateAnnouncements(readJson(`${main}/announcements.json`), version, date));
  add(`${main}/indexContent.json`, updateIndexContent(readJson(`${main}/indexContent.json`), version));

  for (const lang of LANGUAGES) {
    add(`${main}/${lang}/downloadContent.json`, updateDownloadContent(readJson(`${main}/${lang}/downloadContent.json`), lang, version, date));
    add(`${main}/${lang}/downloadLinux.json`, updatePlatform(readJson(`${main}/${lang}/downloadLinux.json`), linuxDownloads, version));
    add(`${main}/${lang}/downloadMac.json`, updatePlatform(readJson(`${main}/${lang}/downloadMac.json`), macDownloads, version));
    add(`${main}/${lang}/downloadWindows.json`, updatePlatform(readJson(`${main}/${lang}/downloadWindows.json`), windowsDownloads, version));
    add(`${main}/${lang}/downloadNightly.json`, updateNightly(readJson(`${main}/${lang}/downloadNightly.json`), version, date));
  }

  if (dryRun) {
    console.log(`\n📋 ${updates.length} file(s) would be updated:`);
    updates.forEach((u) => console.log(`  - ${u.filePath}`));
    console.log('\n🎉 Dry run completed. No changes were made.');
    return;
  }

  // Create backups, then write
  const backupDir = `backup-${Date.now()}`;
  fs.mkdirSync(backupDir, { recursive: true });
  for (const u of updates) {
    const backupPath = path.join(backupDir, u.filePath);
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    fs.copyFileSync(u.filePath, backupPath);
    writeJson(u.filePath, u.data);
    console.log(`✅ Updated ${u.filePath}`);
  }

  console.log(`\n📊 Updated ${updates.length} file(s). Backups saved in ${backupDir}/`);
  console.log('\n📋 Next steps:');
  console.log('1. Review the changes (git diff)');
  console.log('2. Validate: node scripts/validate-json.js ' + version);
  console.log('3. Commit and push the changes');
}

module.exports = { run, VERSION_RE };

// Run directly: node scripts/update-version.js <version> [date]
if (require.main === module) {
  const version = process.argv[2];
  const date = process.argv[3] || new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  if (!version) {
    console.error('Usage: node scripts/update-version.js <version> [date]');
    console.error('Example: node scripts/update-version.js 1.22.1 8/26/2026');
    process.exit(1);
  }

  run({ version, date }).catch((error) => {
    console.error(`💥 ${error.message}`);
    process.exit(1);
  });
}
