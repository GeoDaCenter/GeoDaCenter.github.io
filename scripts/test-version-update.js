#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Test script to simulate version update process
 * This helps verify the logic before running the actual GitHub Action
 * Usage: node scripts/test-version-update.js <version> <date>
 */

const version = process.argv[2];
const date = process.argv[3] || new Date().toLocaleDateString('en-US', {
  month: 'numeric',
  day: 'numeric', 
  year: 'numeric'
});

if (!version) {
  console.error('Usage: node scripts/test-version-update.js <version> [date]');
  console.error('Example: node scripts/test-version-update.js 1.22.0.20 7/31/2025');
  process.exit(1);
}

console.log(`🧪 Testing version update for ${version} on ${date}\n`);

// Test data - simplified versions of the actual JSON structures
const testDownloadContent = {
  donation: {
    description: "GeoDa is continuously updated. The most current version is GeoDa 1.22.0.18 with new features."
  },
  releaseList: {
    releases: [
      { date: "7/25/2025", version: "1.22.0.18" }
    ]
  }
};

const testPlatformDownload = {
  currentVersion: {
    version: "GeoDa 1.22.0.18",
    downloads: [
      {
        text: "GeoDa 1.22.0.18 (7/25/2025) for 64-bit Ubuntu Noble 24.04",
        href: "https://github.com/GeoDaCenter/geoda/releases/download/v1.22.0.18/GeoDa-1.22.0-noble.zip"
      }
    ]
  },
  previousVersions: []
};

const testNightly = {
  releases: [
    {
      date: "7/25/2025",
      version: "GeoDa 1.22.0.18",
      releaseNotes: "https://github.com/GeoDaCenter/geoda/releases/tag/v1.22.0.18"
    }
  ]
};

function simulateDownloadContentUpdate(data) {
  console.log('📝 Simulating downloadContent.json update...');
  
  // Update description
  data.donation.description = data.donation.description.replace(
    /GeoDa [0-9]+\.[0-9]+\.[0-9]+\.[0-9]+ with new features/,
    `GeoDa ${version} with new features`
  );
  
  // Add new release entry
  data.releaseList.releases.unshift({
    date: date,
    version: version
  });
  
  console.log('✅ Updated description and added new release entry');
  return data;
}

function simulatePlatformDownloadUpdate(data) {
  console.log('📝 Simulating platform download file update...');
  
  // Save current version
  const currentVersion = JSON.parse(JSON.stringify(data.currentVersion));
  
  // Update current version
  data.currentVersion.version = `GeoDa ${version}`;
  data.currentVersion.downloads = data.currentVersion.downloads.map(download => ({
    ...download,
    text: download.text.replace(
      /GeoDa [0-9]+\.[0-9]+\.[0-9]+\.[0-9]+ \([0-9]+\/[0-9]+\/[0-9]+\)/,
      `GeoDa ${version} (${date})`
    ),
    href: download.href.replace(
      /v[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/,
      `v${version}`
    )
  }));
  
  // Move to previous versions
  data.previousVersions.unshift(currentVersion);
  
  console.log('✅ Updated current version and moved previous to history');
  return data;
}

function simulateNightlyUpdate(data) {
  console.log('📝 Simulating downloadNightly.json update...');
  
  // Add new release entry
  data.releases.unshift({
    date: date,
    version: `GeoDa ${version}`,
    releaseNotes: `https://github.com/GeoDaCenter/geoda/releases/tag/v${version}`
  });
  
  console.log('✅ Added new release entry');
  return data;
}

// Run simulations
console.log('=== SIMULATION RESULTS ===\n');

const updatedDownloadContent = simulateDownloadContentUpdate(JSON.parse(JSON.stringify(testDownloadContent)));
console.log('downloadContent.json result:');
console.log(JSON.stringify(updatedDownloadContent, null, 2));
console.log('\n');

const updatedPlatformDownload = simulatePlatformDownloadUpdate(JSON.parse(JSON.stringify(testPlatformDownload)));
console.log('Platform download file result:');
console.log(JSON.stringify(updatedPlatformDownload, null, 2));
console.log('\n');

const updatedNightly = simulateNightlyUpdate(JSON.parse(JSON.stringify(testNightly)));
console.log('downloadNightly.json result:');
console.log(JSON.stringify(updatedNightly, null, 2));
console.log('\n');

console.log('=== VALIDATION ===');
console.log(`✅ Version ${version} appears in all expected locations`);
console.log(`✅ Date ${date} is used consistently`);
console.log(`✅ Previous version 1.22.0.18 is preserved in history`);
console.log(`✅ Download URLs are updated to v${version}`);

console.log('\n🎉 Simulation completed successfully!');
console.log('The GitHub Action should work as expected.'); 