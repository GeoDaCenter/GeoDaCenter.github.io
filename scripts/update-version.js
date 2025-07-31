#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Standalone version update script
 * Mirrors the functionality of the GitHub Action for local testing and manual updates
 * 
 * Usage: 
 *   node scripts/update-version.js <version> [date]
 *   node scripts/update-version.js 1.22.0.20 7/31/2025
 *   node scripts/update-version.js 1.22.0.20 (uses current date)
 */

const version = process.argv[2];
const customDate = process.argv[3];

if (!version) {
  console.error('Usage: node scripts/update-version.js <version> [date]');
  console.error('Example: node scripts/update-version.js 1.22.0.20 7/31/2025');
  console.error('Example: node scripts/update-version.js 1.22.0.20 (uses current date)');
  process.exit(1);
}

// Generate date if not provided
const date = customDate || new Date().toLocaleDateString('en-US', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric'
});

console.log(`🔄 Updating version to: ${version}`);
console.log(`📅 Using date: ${date}\n`);

// Files to update
const filesToUpdate = [
  'src/data/downloadContent.json',
  'src/data/downloadLinux.json',
  'src/data/downloadMac.json',
  'src/data/downloadWindows.json',
  'src/data/downloadNightly.json'
];

// Language-specific files
const languages = ['de', 'es', 'zh-Hans'];
languages.forEach(lang => {
  filesToUpdate.push(`src/data/${lang}/downloadContent.json`);
  filesToUpdate.push(`src/data/${lang}/downloadLinux.json`);
  filesToUpdate.push(`src/data/${lang}/downloadMac.json`);
  filesToUpdate.push(`src/data/${lang}/downloadWindows.json`);
  filesToUpdate.push(`src/data/${lang}/downloadNightly.json`);
});

/**
 * Update downloadContent.json
 */
function updateDownloadContent(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${filePath} (file not found)`);
    return;
  }

  console.log(`📝 Updating ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Update description text
    if (data.donation && data.donation.description) {
      data.donation.description = data.donation.description.replace(
        /GeoDa [0-9]+\.[0-9]+\.[0-9]+\.[0-9]+ with new features/g,
        `GeoDa ${version} with new features`
      );
    }
    
    // Add new release entry at the beginning
    if (data.releaseList && data.releaseList.releases) {
      data.releaseList.releases.unshift({
        date: date,
        version: version
      });
    }
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`✅ Updated ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}: ${error.message}`);
    throw error;
  }
}

/**
 * Update platform-specific download files (Linux, Mac, Windows)
 */
function updatePlatformDownload(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${filePath} (file not found)`);
    return;
  }

  console.log(`📝 Updating ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Save current version
    const currentVersion = JSON.parse(JSON.stringify(data.currentVersion));
    
    // Update current version
    if (data.currentVersion) {
      data.currentVersion.version = `GeoDa ${version}`;
      
      // Update downloads array
      if (data.currentVersion.downloads) {
        data.currentVersion.downloads = data.currentVersion.downloads.map(download => ({
          ...download,
          text: download.text.replace(
            /GeoDa [0-9]+\.[0-9]+\.[0-9]+\.[0-9]+ \([0-9]+\/[0-9]+\/[0-9]+\)/g,
            `GeoDa ${version} (${date})`
          ),
          href: download.href.replace(
            /v[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/g,
            `v${version}`
          )
        }));
      }
    }
    
    // Move current version to previous versions
    if (data.previousVersions) {
      data.previousVersions.unshift(currentVersion);
    }
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`✅ Updated ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}: ${error.message}`);
    throw error;
  }
}

/**
 * Update nightly build file
 */
function updateNightly(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${filePath} (file not found)`);
    return;
  }

  console.log(`📝 Updating ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Add new release entry at the beginning
    if (data.releases) {
      data.releases.unshift({
        date: date,
        version: `GeoDa ${version}`,
        releaseNotes: `https://github.com/GeoDaCenter/geoda/releases/tag/v${version}`
      });
    }
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`✅ Updated ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}: ${error.message}`);
    throw error;
  }
}

/**
 * Create backup of original files
 */
function createBackups() {
  console.log('💾 Creating backups...');
  
  const backupDir = `backup-${Date.now()}`;
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const backupPath = path.join(backupDir, filePath);
      const backupDirPath = path.dirname(backupPath);
      
      if (!fs.existsSync(backupDirPath)) {
        fs.mkdirSync(backupDirPath, { recursive: true });
      }
      
      fs.copyFileSync(filePath, backupPath);
    }
  });
  
  console.log(`✅ Backups created in ${backupDir}/`);
  return backupDir;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting version update process...\n');
  
  // Create backups
  const backupDir = createBackups();
  
  let successCount = 0;
  let errorCount = 0;
  
  // Process each file
  for (const filePath of filesToUpdate) {
    try {
      if (filePath.includes('downloadContent.json')) {
        updateDownloadContent(filePath);
      } else if (filePath.includes('downloadNightly.json')) {
        updateNightly(filePath);
      } else if (filePath.includes('downloadLinux.json') || 
                 filePath.includes('downloadMac.json') || 
                 filePath.includes('downloadWindows.json')) {
        updatePlatformDownload(filePath);
      }
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`Failed to update ${filePath}: ${error.message}`);
    }
  }
  
  console.log('\n📊 Update Summary:');
  console.log(`✅ Successfully updated: ${successCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`💾 Backups saved in: ${backupDir}/`);
  
  if (errorCount > 0) {
    console.log('\n⚠️  Some files failed to update. Check the errors above.');
    console.log(`💡 You can restore from backup: cp -r ${backupDir}/* .`);
    process.exit(1);
  } else {
    console.log('\n🎉 All files updated successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Review the changes in your files');
    console.log('2. Test the website to ensure everything works');
    console.log('3. Commit and push the changes');
    console.log(`4. If needed, restore from backup: cp -r ${backupDir}/* .`);
  }
}

// Run the script
main().catch(error => {
  console.error('💥 Fatal error:', error.message);
  process.exit(1);
}); 