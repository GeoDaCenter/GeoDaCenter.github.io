# Manual Indexing Guide for GeoDa

This guide explains how to add records to your Algolia index, covering both automatic (DocSearch) and manual indexing approaches.

## 🔄 Two Approaches to Indexing

### 1. DocSearch (Automatic) - Recommended for Website Content
DocSearch automatically crawls your website and indexes all content. This is already configured for your GeoDa site.

### 2. Manual Indexing - For Custom Data
Manual indexing is useful for adding custom records that aren't part of your website content.

## 🚀 Quick Start: Manual Indexing

### Prerequisites

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file with:
   ```bash
   ALGOLIA_APP_ID=your_app_id_here
   ALGOLIA_ADMIN_API_KEY=your_admin_api_key_here  # Note: This is different from search key
   ALGOLIA_INDEX_NAME=geoda
   ```

3. **Get your Admin API Key**:
   - Go to your Algolia dashboard
   - Navigate to **API Keys**
   - Copy the **Admin API Key** (not the Search API Key)

### Basic Example

```javascript
const { algoliasearch } = require('algoliasearch');

const client = algoliasearch('YOUR_APP_ID', 'YOUR_ADMIN_API_KEY');
const index = client.initIndex('geoda');

// Add a single record
const record = {
  objectID: 'unique-id-1',
  title: 'Spatial Autocorrelation Tutorial',
  content: 'Learn how to perform spatial autocorrelation analysis',
  type: 'tutorial',
  url: '/tutorials/spatial-autocorrelation'
};

index.saveObject(record)
  .then(() => console.log('Record added successfully!'))
  .catch(err => console.error('Error:', err));
```

## 📝 Your Example Explained

Here's your example adapted for GeoDa:

```javascript
const { algoliasearch } = require('algoliasearch');

const client = algoliasearch('YOUR_APP_ID', 'YOUR_ADMIN_API_KEY');
const index = client.initIndex('geoda');

// Fetch and index objects in Algolia
const processRecords = async () => {
  try {
    // Fetch data from external source
    const datasetRequest = await fetch('https://dashboard.algolia.com/api/1/sample_datasets?type=movie');
    const movies = await datasetRequest.json();
    
    // Transform data for GeoDa context
    const transformedData = movies.map(movie => ({
      ...movie,
      objectID: `movie-${movie.objectID}`,
      type: 'external-data',
      source: 'algolia-sample',
      category: 'entertainment'
    }));
    
    // Save to your index
    return await index.saveObjects(transformedData);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

processRecords()
  .then(() => console.log('Successfully indexed objects!'))
  .catch((err) => console.error(err));
```

## 🛠️ Available Scripts

### Run the Complete Example
```bash
npm run index-records
```

This will:
- Add tutorial records
- Add FAQ records  
- Add sample dataset records
- Search for records
- Demonstrate all indexing operations

### Individual Functions

You can also use individual functions from the script:

```javascript
const { 
  addTutorialRecords, 
  addFAQRecords, 
  addSampleDatasets,
  updateRecords,
  deleteRecords,
  searchRecords 
} = require('./scripts/manual-indexing-cjs.js');

// Add specific types of records
await addTutorialRecords();
await addFAQRecords();
await addSampleDatasets();
```

## 📊 Record Structure Examples

### Tutorial Records
```javascript
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
}
```

### FAQ Records
```javascript
{
  objectID: 'faq-installation',
  question: 'How do I install GeoDa?',
  answer: 'GeoDa can be downloaded from the official website...',
  type: 'faq',
  category: 'installation',
  tags: ['installation', 'download', 'setup'],
  language: 'en'
}
```

### Dataset Records
```javascript
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
}
```

## 🔧 Common Operations

### Add Records
```javascript
// Add single record
await index.saveObject(record);

// Add multiple records
await index.saveObjects(records);
```

### Update Records
```javascript
// Partial update (only specified fields)
await index.partialUpdateObject({
  objectID: 'existing-id',
  title: 'Updated Title'
});

// Full update
await index.saveObject({
  objectID: 'existing-id',
  ...updatedRecord
});
```

### Delete Records
```javascript
// Delete single record
await index.deleteObject('object-id');

// Delete multiple records
await index.deleteObjects(['id1', 'id2', 'id3']);
```

### Search Records
```javascript
// Basic search
const result = await index.search('spatial autocorrelation');

// Search with filters
const result = await index.search('tutorial', {
  filters: 'type:tutorial AND difficulty:beginner',
  hitsPerPage: 10
});
```

## 🌍 Multi-language Support

For multi-language content, include a `language` field:

```javascript
const records = [
  {
    objectID: 'tutorial-en',
    title: 'Spatial Analysis',
    content: 'Learn spatial analysis...',
    language: 'en'
  },
  {
    objectID: 'tutorial-zh',
    title: '空间分析',
    content: '学习空间分析...',
    language: 'zh-Hans'
  }
];
```

## 🔍 Search Configuration

### Faceted Search
Configure facets in your `docsearch.config.json`:

```json
{
  "custom_settings": {
    "attributesForFaceting": [
      "type",
      "language", 
      "category",
      "difficulty",
      "tags"
    ]
  }
}
```

### Search Filters
```javascript
// Search by type
await index.search('analysis', { filters: 'type:tutorial' });

// Search by multiple criteria
await index.search('spatial', { 
  filters: 'type:tutorial AND difficulty:intermediate AND language:en' 
});
```

## 📈 Best Practices

### 1. Unique ObjectIDs
Always use unique, descriptive objectIDs:
```javascript
// Good
objectID: 'tutorial-spatial-autocorrelation-v2'

// Avoid
objectID: '1'
```

### 2. Consistent Structure
Use consistent field names and data types across records.

### 3. Meaningful Content
Include relevant, searchable content in your records.

### 4. Proper Typing
Use the `type` field to categorize records:
- `tutorial`
- `faq`
- `dataset`
- `documentation`
- `external-data`

### 5. Tags for Filtering
Use tags for flexible filtering and categorization.

## 🚨 Important Notes

### API Keys
- **Search API Key**: Used in frontend (safe to expose)
- **Admin API Key**: Used for indexing (keep secret)

### Rate Limits
Algolia has rate limits. For bulk operations, consider:
- Batching records (max 1000 per batch)
- Adding delays between requests
- Using the `batch` method for large datasets

### Index Size
Monitor your index size and consider:
- Removing old/unused records
- Optimizing record structure
- Using partial updates when possible

## 🔗 Integration with DocSearch

Manual records work alongside DocSearch:
- DocSearch indexes website content automatically
- Manual indexing adds custom data
- Both appear in search results
- Use different `type` values to distinguish them

## 📚 Additional Resources

- [Algolia JavaScript API Reference](https://www.algolia.com/doc/api-client/javascript/)
- [Algolia Search API Guide](https://www.algolia.com/doc/guides/searching/)
- [DocSearch Configuration](https://docsearch.algolia.com/docs/config-file/)

## 🆘 Troubleshooting

### Common Issues

**"Invalid API key"**:
- Check you're using the Admin API key, not the Search API key
- Verify the API key has write permissions

**"Index not found"**:
- Verify the index name matches your DocSearch configuration
- Check the index exists in your Algolia dashboard

**"Rate limit exceeded"**:
- Reduce the number of requests
- Add delays between operations
- Use batch operations for large datasets

**"Records not appearing in search"**:
- Check the records were indexed successfully
- Verify search filters aren't excluding the records
- Check the index settings in Algolia dashboard 