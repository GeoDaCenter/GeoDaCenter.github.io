#!/usr/bin/env node

/**
 * Algolia DocSearch Setup Script for GeoDa
 * 
 * This script helps validate and set up Algolia DocSearch configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 GeoDa Algolia DocSearch Setup\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env file found');
  
  // Read and validate .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {
    ALGOLIA_APP_ID: envContent.includes('ALGOLIA_APP_ID='),
    ALGOLIA_SEARCH_API_KEY: envContent.includes('ALGOLIA_SEARCH_API_KEY='),
    ALGOLIA_ADMIN_API_KEY: envContent.includes('ALGOLIA_ADMIN_API_KEY='),
    ALGOLIA_INDEX_NAME: envContent.includes('ALGOLIA_INDEX_NAME=')
  };
  
  console.log('\n📋 Environment Variables Status:');
  Object.entries(envVars).forEach(([key, exists]) => {
    console.log(`  ${exists ? '✅' : '❌'} ${key}`);
  });
  
  if (Object.values(envVars).every(Boolean)) {
    console.log('\n🎉 All required environment variables are configured!');
    console.log('\nNext steps:');
    console.log('1. Apply for DocSearch at: https://docsearch.algolia.com/apply/');
    console.log('2. Use the docsearch.config.json file in this repository');
    console.log('3. Set up GitHub secrets for production deployment');
    console.log('4. Test the search functionality');
  } else {
    console.log('\n⚠️  Some environment variables are missing.');
    console.log('Please check ENV_SETUP.md for instructions.');
  }
} else {
  console.log('❌ .env file not found');
  console.log('\n📝 Creating .env.example...');
  
  const envExample = `# Algolia DocSearch Configuration
# Get these values from your Algolia DocSearch dashboard after approval

# Your Algolia Application ID
ALGOLIA_APP_ID=your_app_id_here

# Your Algolia Search API Key (public key, safe to commit)
ALGOLIA_SEARCH_API_KEY=your_search_api_key_here

# Your Algolia Admin API Key (private key, keep secret - for manual indexing)
ALGOLIA_ADMIN_API_KEY=your_admin_api_key_here

# Your Algolia Index Name
ALGOLIA_INDEX_NAME=geoda

# Google Analytics (optional)
GOOGLE_ANALYTICS_ID=your_ga_id_here
`;
  
  fs.writeFileSync(envPath, envExample);
  console.log('✅ .env file created with example values');
  console.log('\n📋 Next steps:');
  console.log('1. Edit .env file with your actual Algolia credentials');
  console.log('2. Apply for DocSearch at: https://docsearch.algolia.com/apply/');
  console.log('3. Use the docsearch.config.json file in this repository');
}

// Check if docsearch.config.json exists
const configPath = path.join(process.cwd(), 'docsearch.config.json');
const configExists = fs.existsSync(configPath);

console.log(`\n📄 DocSearch Configuration: ${configExists ? '✅ Found' : '❌ Missing'}`);

if (configExists) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log(`   Index name: ${config.index_name}`);
    console.log(`   Start URLs: ${config.start_urls.length} configured`);
    console.log(`   Max hits: ${config.nb_hits}`);
  } catch (error) {
    console.log('   ⚠️  Configuration file has invalid JSON');
  }
}

console.log('\n📚 Documentation:');
console.log('- ALGOLIA_SETUP.md - Complete setup guide');
console.log('- ENV_SETUP.md - Environment variables guide');
console.log('- https://docsearch.algolia.com/docs/ - Official DocSearch docs'); 