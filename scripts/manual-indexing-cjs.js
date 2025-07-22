#!/usr/bin/env node

/**
 * Manual Algolia Indexing Script for GeoDa (CommonJS Version)
 * 
 * This script demonstrates how to manually add records to your Algolia index
 * Use this for custom data that isn't part of your website content
 */

const { algoliasearch } = require('algoliasearch');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Algolia client
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY // Note: This needs the ADMIN API key, not the search key
);

const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME || 'geoda');

/**
 * Example 1: Add custom GeoDa tutorial records
 */
const addTutorialRecords = async () => {
  const tutorials = [
    {
      objectID: 'tutorial-spatial-autocorrelation',
      title: 'Spatial Autocorrelation Analysis',
      content: 'Learn how to perform spatial autocorrelation analysis in GeoDa',
      type: 'tutorial',
      category: 'spatial-analysis',
      difficulty: 'intermediate',
      url: '/tutorials/spatial-autocorrelation',
      tags: ['spatial-autocorrelation', 'moran-i', 'analysis'],
      language: 'en'
    },
    {
      objectID: 'tutorial-lisa-analysis',
      title: 'Local Indicators of Spatial Association (LISA)',
      content: 'Step-by-step guide to LISA analysis in GeoDa',
      type: 'tutorial',
      category: 'spatial-analysis',
      difficulty: 'advanced',
      url: '/tutorials/lisa-analysis',
      tags: ['lisa', 'local-analysis', 'clusters'],
      language: 'en'
    },
    {
      objectID: 'tutorial-data-import',
      title: 'Importing Spatial Data into GeoDa',
      content: 'How to import various spatial data formats into GeoDa',
      type: 'tutorial',
      category: 'data-management',
      difficulty: 'beginner',
      url: '/tutorials/data-import',
      tags: ['import', 'shapefile', 'csv', 'data'],
      language: 'en'
    }
  ];

  try {
    const result = await index.saveObjects(tutorials);
    console.log('✅ Successfully added tutorial records:', result.objectIDs);
    return result;
  } catch (error) {
    console.error('❌ Error adding tutorial records:', error);
    throw error;
  }
};

/**
 * Example 2: Add FAQ records
 */
const addFAQRecords = async () => {
  const faqs = [
    {
      objectID: 'faq-installation',
      question: 'How do I install GeoDa?',
      answer: 'GeoDa can be downloaded from the official website. Choose the version for your operating system (Windows, macOS, or Linux).',
      type: 'faq',
      category: 'installation',
      tags: ['installation', 'download', 'setup'],
      language: 'en'
    },
    {
      objectID: 'faq-data-formats',
      question: 'What data formats does GeoDa support?',
      answer: 'GeoDa supports shapefiles (.shp), GeoJSON, CSV files with coordinates, and various database formats.',
      type: 'faq',
      category: 'data-formats',
      tags: ['formats', 'shapefile', 'geojson', 'csv'],
      language: 'en'
    }
  ];

  try {
    const result = await index.saveObjects(faqs);
    console.log('✅ Successfully added FAQ records:', result.objectIDs);
    return result;
  } catch (error) {
    console.error('❌ Error adding FAQ records:', error);
    throw error;
  }
};

/**
 * Example 3: Add sample datasets
 */
const addSampleDatasets = async () => {
  const datasets = [
    {
      objectID: 'dataset-chicago-crime',
      name: 'Chicago Crime Data',
      description: 'Sample crime data for Chicago neighborhoods',
      type: 'dataset',
      category: 'sample-data',
      fileSize: '2.3 MB',
      records: 15000,
      url: '/sample-data/chicago-crime.zip',
      tags: ['crime', 'chicago', 'sample', 'neighborhoods'],
      language: 'en'
    },
    {
      objectID: 'dataset-boston-housing',
      name: 'Boston Housing Data',
      description: 'Housing data for Boston metropolitan area',
      type: 'dataset',
      category: 'sample-data',
      fileSize: '1.8 MB',
      records: 8000,
      url: '/sample-data/boston-housing.zip',
      tags: ['housing', 'boston', 'sample', 'real-estate'],
      language: 'en'
    }
  ];

  try {
    const result = await index.saveObjects(datasets);
    console.log('✅ Successfully added dataset records:', result.objectIDs);
    return result;
  } catch (error) {
    console.error('❌ Error adding dataset records:', error);
    throw error;
  }
};

/**
 * Example 4: Update existing records
 */
const updateRecords = async () => {
  const updates = [
    {
      objectID: 'tutorial-spatial-autocorrelation',
      title: 'Spatial Autocorrelation Analysis (Updated)',
      lastUpdated: new Date().toISOString(),
      version: '2.0'
    }
  ];

  try {
    const result = await index.partialUpdateObjects(updates);
    console.log('✅ Successfully updated records:', result.objectIDs);
    return result;
  } catch (error) {
    console.error('❌ Error updating records:', error);
    throw error;
  }
};

/**
 * Example 5: Delete records
 */
const deleteRecords = async (objectIDs) => {
  try {
    const result = await index.deleteObjects(objectIDs);
    console.log('✅ Successfully deleted records:', objectIDs);
    return result;
  } catch (error) {
    console.error('❌ Error deleting records:', error);
    throw error;
  }
};

/**
 * Example 6: Search and filter records
 */
const searchRecords = async (query, filters = '') => {
  try {
    const result = await index.search(query, {
      filters: filters,
      hitsPerPage: 20,
      attributesToRetrieve: ['title', 'content', 'type', 'url']
    });
    console.log('🔍 Search results:', result.hits);
    return result;
  } catch (error) {
    console.error('❌ Error searching records:', error);
    throw error;
  }
};

/**
 * Example 7: Your example - Fetch and index external data
 */
const processExternalRecords = async () => {
  try {
    // Fetch data from external API
    const datasetRequest = await fetch('https://dashboard.algolia.com/api/1/sample_datasets?type=movie');
    const movies = await datasetRequest.json();
    
    // Transform data for GeoDa context
    const transformedMovies = movies.map(movie => ({
      ...movie,
      objectID: `movie-${movie.objectID}`,
      type: 'external-data',
      source: 'algolia-sample',
      category: 'entertainment'
    }));
    
    // Save to your index
    const result = await index.saveObjects(transformedMovies);
    console.log('✅ Successfully indexed external records:', result.objectIDs);
    return result;
  } catch (error) {
    console.error('❌ Error processing external records:', error);
    throw error;
  }
};

/**
 * Main function to run examples
 */
const main = async () => {
  console.log('🚀 Starting manual indexing examples...\n');

  try {
    // Add different types of records
    await addTutorialRecords();
    await addFAQRecords();
    await addSampleDatasets();

    // Search for records
    console.log('\n🔍 Searching for tutorials...');
    await searchRecords('spatial', 'type:tutorial');

    console.log('\n🎉 Manual indexing completed successfully!');
  } catch (error) {
    console.error('💥 Error in main function:', error);
  }
};

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = {
  addTutorialRecords,
  addFAQRecords,
  addSampleDatasets,
  updateRecords,
  deleteRecords,
  searchRecords,
  processExternalRecords
}; 