# Environment Variables Setup for Algolia DocSearch

## Required Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Algolia DocSearch Configuration
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
```

## GitHub Secrets Setup

For production deployment, add these as GitHub repository secrets:

1. Go to your GitHub repository: `https://github.com/GeoDaCenter/geodacenter.github.io`
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Add the following repository secrets:
   - `ALGOLIA_APP_ID`: Your Algolia Application ID
   - `ALGOLIA_SEARCH_API_KEY`: Your Algolia Search API Key
   - `ALGOLIA_ADMIN_API_KEY`: Your Algolia Admin API Key (for manual indexing)
   - `ALGOLIA_INDEX_NAME`: Your Algolia Index Name

## Local Development

For local development, create a `.env` file in your project root with the actual values.

## Security Notes

- `ALGOLIA_SEARCH_API_KEY` is the **public** search API key, which is safe to commit
- `ALGOLIA_ADMIN_API_KEY` is the **private** admin API key, which should never be committed
- The search API key has limited permissions and can only perform searches
- The admin API key has full permissions and can modify the index 