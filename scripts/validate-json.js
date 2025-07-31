#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Validates JSON files after version updates
 * Usage: node scripts/validate-json.js [version]
 */

const version = process.argv[2];

if (!version) {
  console.error('Usage: node scripts/validate-json.js <version>');
  console.error('Example: node scripts/validate-json.js 1.22.0.20');
  process.exit(1);
}

const filesToValidate = [
  'src/data/downloadContent.json',
  'src/data/downloadLinux.json',
  'src/data/downloadMac.json',
  'src/data/downloadWindows.json',
  'src/data/downloadNightly.json'
];

// Add language-specific files
const languages = ['de', 'es', 'zh-Hans'];
languages.forEach(lang => {
  filesToValidate.push(`src/data/${lang}/downloadContent.json`);
  filesToValidate.push(`src/data/${lang}/downloadLinux.json`);
  filesToValidate.push(`src/data/${lang}/downloadMac.json`);
  filesToValidate.push(`src/data/${lang}/downloadWindows.json`);
  filesToValidate.push(`src/data/${lang}/downloadNightly.json`);
});

let hasErrors = false;

function validateFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${filePath} (file not found)`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    
    console.log(`✅ ${filePath} - Valid JSON`);
    
    // Additional validation for specific files
    if (filePath.includes('downloadContent.json')) {
      validateDownloadContent(json, filePath);
    } else if (filePath.includes('downloadNightly.json')) {
      validateDownloadNightly(json, filePath);
    } else if (filePath.includes('downloadLinux.json') || 
               filePath.includes('downloadMac.json') || 
               filePath.includes('downloadWindows.json')) {
      validatePlatformDownload(json, filePath);
    }
    
  } catch (error) {
    console.error(`❌ ${filePath} - Invalid JSON: ${error.message}`);
    hasErrors = true;
  }
}

function validateDownloadContent(json, filePath) {
  // Check if version is mentioned in description
  const description = json.donation?.description || '';
  if (!description.includes(`GeoDa ${version}`)) {
    console.warn(`⚠️  ${filePath} - Version ${version} not found in description`);
  }
  
  // Check if new release entry exists
  const releases = json.releaseList?.releases || [];
  const hasNewRelease = releases.some(release => release.version === version);
  if (!hasNewRelease) {
    console.warn(`⚠️  ${filePath} - Version ${version} not found in releases list`);
  }
}

function validateDownloadNightly(json, filePath) {
  const releases = json.releases || [];
  const hasNewRelease = releases.some(release => release.version === `GeoDa ${version}`);
  if (!hasNewRelease) {
    console.warn(`⚠️  ${filePath} - Version GeoDa ${version} not found in releases list`);
  }
}

function validatePlatformDownload(json, filePath) {
  // Check current version
  const currentVersion = json.currentVersion?.version;
  if (currentVersion !== `GeoDa ${version}`) {
    console.warn(`⚠️  ${filePath} - Current version should be "GeoDa ${version}", got "${currentVersion}"`);
  }
  
  // Check if downloads contain the new version
  const downloads = json.currentVersion?.downloads || [];
  const hasNewVersion = downloads.some(download => 
    download.text.includes(version) && download.href.includes(`v${version}`)
  );
  if (!hasNewVersion) {
    console.warn(`⚠️  ${filePath} - Version ${version} not found in current downloads`);
  }
}

console.log(`🔍 Validating JSON files for version ${version}...\n`);

filesToValidate.forEach(validateFile);

if (hasErrors) {
  console.log('\n❌ Validation completed with errors');
  process.exit(1);
} else {
  console.log('\n✅ All files validated successfully');
} 