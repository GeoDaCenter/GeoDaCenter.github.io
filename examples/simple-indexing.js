/**
 * Simple Example: Adding Records to Algolia Index
 * 
 * This example shows how to add records to your Algolia index,
 * similar to the example you provided.
 */

const { algoliasearch } = require('algoliasearch');
require('dotenv').config();

// Initialize Algolia client
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID, 
  process.env.ALGOLIA_ADMIN_API_KEY // Use Admin API key for indexing
);

const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME || 'geoda');

// Example 1: Your original example adapted for GeoDa
const processRecords = async () => {
  try {
    // Fetch data from external API (your example)
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
    return await index.saveObjects(transformedMovies);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Example 2: Add custom GeoDa data
const addGeoDaRecords = async () => {
  const geodaRecords = [
    {
      objectID: 'tutorial-spatial-autocorrelation',
      title: 'Spatial Autocorrelation Analysis',
      content: 'Learn how to perform spatial autocorrelation analysis in GeoDa',
      type: 'tutorial',
      category: 'spatial-analysis',
      url: '/tutorials/spatial-autocorrelation'
    },
    {
      objectID: 'faq-installation',
      question: 'How do I install GeoDa?',
      answer: 'GeoDa can be downloaded from the official website.',
      type: 'faq',
      category: 'installation'
    },
    {
      objectID: 'dataset-chicago-crime',
      name: 'Chicago Crime Data',
      description: 'Sample crime data for Chicago neighborhoods',
      type: 'dataset',
      category: 'sample-data',
      url: '/sample-data/chicago-crime.zip'
    }
  ];

  try {
    return await index.saveObjects(geodaRecords);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Example 3: Update existing records
const updateRecord = async () => {
  try {
    return await index.partialUpdateObject({
      objectID: 'tutorial-spatial-autocorrelation',
      title: 'Spatial Autocorrelation Analysis (Updated)',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Example 4: Delete records
const deleteRecord = async (objectID) => {
  try {
    return await index.deleteObject(objectID);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Example 5: Search records
const searchRecords = async (query) => {
  try {
    const result = await index.search(query);
    console.log('Search results:', result.hits);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Run examples
const runExamples = async () => {
  console.log('🚀 Running Algolia indexing examples...\n');

  try {
    // Add GeoDa records
    console.log('1. Adding GeoDa records...');
    await addGeoDaRecords();
    console.log('✅ GeoDa records added successfully!\n');

    // Search for records
    console.log('2. Searching for "spatial"...');
    await searchRecords('spatial');
    console.log('✅ Search completed!\n');

    // Update a record
    console.log('3. Updating a record...');
    await updateRecord();
    console.log('✅ Record updated successfully!\n');

    console.log('🎉 All examples completed successfully!');
  } catch (error) {
    console.error('💥 Error running examples:', error);
  }
};

// Export functions for use in other scripts
module.exports = {
  processRecords,
  addGeoDaRecords,
  updateRecord,
  deleteRecord,
  searchRecords,
  runExamples
};

// Run if called directly
if (require.main === module) {
  runExamples();
} 