# Algolia Search Setup for GeoDa Website

This guide explains how to set up Algolia search for the GeoDa website.

## Prerequisites

1. An Algolia account (free tier available)
2. Access to the GeoDa GitHub repository

## Setup Steps

### 1. Create an Algolia Account

1. Go to [Algolia's website](https://www.algolia.com/) and create a free account
2. Create a new application for the GeoDa website

### 2. Apply for DocSearch

1. Go to [DocSearch Apply](https://docsearch.algolia.com/apply/) and fill out the application form
2. Use these details:
   - **Application name**: `GeoDa Documentation`
   - **Website URL**: `https://geodacenter.github.io`
   - **Email**: Your email address
   - **Description**: "GeoDa is an introduction to spatial data science with comprehensive documentation, tutorials, and resources"
   - **GitHub repository**: `https://github.com/GeoDaCenter/geodacenter.github.io`
   - **Framework**: Docusaurus

### 3. Configure DocSearch Crawler

Once approved, you'll receive access to the DocSearch dashboard. Use the configuration file provided in this repository:

- **Configuration file**: `docsearch.config.json` (already created)
- **Index name**: `geoda`
- **Crawl frequency**: Daily (automatic)

The configuration includes:
- Multi-language support (en, zh-Hans, es, de)
- Proper content hierarchy (h1-h6)
- Code block indexing
- Sitemap-based crawling
- Exclusion of navigation elements

### 4. Get Your Credentials

From the DocSearch dashboard, you'll receive:
- **Application ID** (appId)
- **Search API Key** (apiKey) 
- **Index Name** (indexName) - should be `geoda`

### 5. Set Environment Variables

#### For Local Development
Create a `.env` file in your project root:
```bash
ALGOLIA_APP_ID=your_app_id_here
ALGOLIA_SEARCH_API_KEY=your_search_api_key_here
ALGOLIA_INDEX_NAME=geoda
```

#### For Production (GitHub Secrets)
1. Go to your GitHub repository: `https://github.com/GeoDaCenter/geodacenter.github.io`
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Add the following repository secrets:
   - `ALGOLIA_APP_ID`: Your Algolia Application ID
   - `ALGOLIA_SEARCH_API_KEY`: Your Algolia Search API Key
   - `ALGOLIA_INDEX_NAME`: Your Algolia Index Name

### 6. Test the Integration

1. Start the crawler from the DocSearch dashboard
2. Wait for the first crawl to complete (usually takes 10-30 minutes)
3. Push your changes to the repository
4. Visit your website and test the search functionality

## Features

- **Global Search**: Search across all documentation pages
- **Search Page**: Dedicated search page at `/search`
- **Keyboard Shortcut**: Press `Ctrl+K` (or `Cmd+K` on Mac) to open search
- **Multi-language Support**: Search works across all supported languages (en, zh-Hans, es, de)
- **Code Search**: Search within code blocks and examples
- **Hierarchical Results**: Results organized by heading levels

## Configuration Details

### DocSearch Configuration (`docsearch.config.json`)

The configuration includes:
- **Start URLs**: Homepage, docs, and blog
- **Content Selectors**: Headings (h1-h6), paragraphs, lists, tables, code blocks
- **Faceted Search**: By type, language, version, tags
- **Sitemap Integration**: Automatic discovery of new pages
- **JavaScript Rendering**: Handles React-rendered content
- **Exclusions**: Navigation, footer, sidebar elements

### Docusaurus Configuration

The Algolia configuration in `docusaurus.config.ts` includes:
- **Contextual Search**: Shows relevant results based on current page
- **URL Transformation**: Removes `/docs/` prefix from results
- **Search Page**: Custom search page at `/search`
- **Conditional Loading**: Only loads when environment variables are set

## Customization

You can customize the search behavior by modifying:

1. **SearchBar.tsx**: Custom search component
2. **search.tsx**: Dedicated search page
3. **docusaurus.config.ts**: Algolia configuration
4. **docsearch.config.json**: Crawler configuration

## Troubleshooting

### Search not working
1. Check that all environment variables are set correctly
2. Verify that DocSearch has indexed your site
3. Check browser console for any errors
4. Ensure the crawler has completed successfully

### Search results not appearing
1. Ensure your site is being crawled by DocSearch
2. Check the Algolia dashboard for indexing status
3. Verify the index name matches your configuration
4. Check if the crawler found your pages

### Crawler issues
1. Verify your site is accessible at the configured URLs
2. Check that your sitemap is valid
3. Ensure robots.txt allows crawling
4. Monitor crawler logs in the DocSearch dashboard

## Monitoring

- **DocSearch Dashboard**: Monitor crawl status and logs
- **Algolia Dashboard**: View search analytics and performance
- **GitHub Actions**: Check deployment status

## Support

For issues with:
- **Algolia/DocSearch**: Contact Algolia support or check [DocSearch documentation](https://docsearch.algolia.com/docs/)
- **Website integration**: Check the GitHub repository issues
- **Configuration**: Review this setup guide

## Additional Resources

- [Algolia DocSearch Documentation](https://docsearch.algolia.com/docs/)
- [Docusaurus Search Integration](https://docusaurus.io/docs/search)
- [Algolia React Components](https://github.com/algolia/docsearch/tree/main/packages/docsearch-react)
- [DocSearch Configuration Reference](https://docsearch.algolia.com/docs/config-file/) 