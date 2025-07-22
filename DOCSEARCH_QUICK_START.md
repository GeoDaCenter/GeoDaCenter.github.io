# DocSearch Crawler Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Apply for DocSearch
- Go to [https://docsearch.algolia.com/apply/](https://docsearch.algolia.com/apply/)
- Fill out the form with:
  - **Application name**: `GeoDa Documentation`
  - **Website URL**: `https://geodacenter.github.io`
  - **Email**: Your email
  - **Description**: "GeoDa is an introduction to spatial data science"
  - **GitHub repository**: `https://github.com/GeoDaCenter/geodacenter.github.io`
  - **Framework**: Docusaurus

### 2. Get Your Credentials
Once approved, you'll receive:
- **Application ID** (appId)
- **Search API Key** (apiKey)
- **Index Name** (indexName) - should be `geoda`

### 3. Configure Environment Variables

#### Local Development
Create a `.env` file in your project root:
```bash
ALGOLIA_APP_ID=your_app_id_here
ALGOLIA_SEARCH_API_KEY=your_search_api_key_here
ALGOLIA_INDEX_NAME=geoda
```

#### Production (GitHub Secrets)
1. Go to your GitHub repository settings
2. Navigate to **Secrets and variables** > **Actions**
3. Add these secrets:
   - `ALGOLIA_APP_ID`
   - `ALGOLIA_SEARCH_API_KEY`
   - `ALGOLIA_INDEX_NAME`

### 4. Use the Configuration File
The `docsearch.config.json` file is already configured for your site with:
- ✅ Multi-language support (en, zh-Hans, es, de)
- ✅ Proper content hierarchy
- ✅ Code block indexing
- ✅ Sitemap integration
- ✅ Navigation exclusions

### 5. Start the Crawler
1. Go to your DocSearch dashboard
2. Use the configuration file from this repository
3. Start the crawler
4. Wait 10-30 minutes for the first crawl

### 6. Test Search
1. Deploy your site
2. Visit `/search` page
3. Test the search functionality
4. Use `Ctrl+K` (or `Cmd+K`) to open search

## 🔧 Configuration Details

### What's Already Configured

**DocSearch Configuration** (`docsearch.config.json`):
- **Index name**: `geoda`
- **Start URLs**: Homepage, docs, blog
- **Content selectors**: Headings (h1-h6), paragraphs, lists, tables, code
- **Faceted search**: By type, language, version, tags
- **Sitemap integration**: Automatic page discovery
- **JavaScript rendering**: Handles React content
- **Exclusions**: Navigation, footer, sidebar

**Docusaurus Configuration** (`docusaurus.config.ts`):
- **Contextual search**: Relevant results based on current page
- **URL transformation**: Removes `/docs/` prefix
- **Custom search page**: `/search`
- **Conditional loading**: Only when environment variables are set

### Features Included
- 🌍 **Multi-language search** (en, zh-Hans, es, de)
- 🔍 **Global search** across all pages
- 📝 **Code search** in code blocks
- 🏗️ **Hierarchical results** organized by headings
- ⌨️ **Keyboard shortcuts** (Ctrl+K / Cmd+K)
- 📱 **Mobile-friendly** search interface

## 🛠️ Setup Script

Run the setup validation script:
```bash
npm run setup-algolia
```

This will:
- ✅ Check if `.env` file exists
- ✅ Validate environment variables
- ✅ Verify DocSearch configuration
- ✅ Provide next steps

## 📊 Monitoring

### DocSearch Dashboard
- Monitor crawl status and logs
- View indexing statistics
- Check for crawl errors

### Algolia Dashboard
- View search analytics
- Monitor search performance
- Check query logs

### GitHub Actions
- Monitor deployment status
- Check build logs

## 🐛 Troubleshooting

### Common Issues

**Search not working:**
1. Check environment variables are set
2. Verify crawler has completed
3. Check browser console for errors

**No search results:**
1. Ensure site is being crawled
2. Check Algolia dashboard for indexing
3. Verify index name matches configuration

**Crawler issues:**
1. Check site accessibility
2. Verify sitemap is valid
3. Ensure robots.txt allows crawling

## 📚 Documentation

- **Complete Setup**: `ALGOLIA_SETUP.md`
- **Environment Variables**: `ENV_SETUP.md`
- **Official Docs**: [https://docsearch.algolia.com/docs/](https://docsearch.algolia.com/docs/)

## 🆘 Support

- **Algolia/DocSearch**: Contact Algolia support
- **Website Integration**: Check GitHub repository issues
- **Configuration**: Review setup guides in this repository

---

**Need help?** Check the troubleshooting section or contact the development team. 