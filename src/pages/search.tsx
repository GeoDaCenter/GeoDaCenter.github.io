import React from 'react';
import Layout from '@theme/Layout';
import { DocSearch } from '@docsearch/react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface AlgoliaConfig {
  appId: string;
  apiKey: string;
  indexName: string;
}

export default function SearchPage(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  
  // Check if Algolia is configured in the site config
  const algoliaConfig = siteConfig.themeConfig?.algolia as AlgoliaConfig | undefined;
  const isAlgoliaConfigured = algoliaConfig?.appId && algoliaConfig?.apiKey && algoliaConfig?.indexName;

  if (!isAlgoliaConfigured) {
    return (
      <Layout
        title="Search - GeoDa"
        description="Search GeoDa documentation, tutorials, and resources"
      >
        <main style={{ padding: '2rem', minHeight: '60vh' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '2rem' }}>
              Search GeoDa Documentation
            </h1>
            <p style={{ fontSize: '18px', color: '#666' }}>
              Search functionality is not currently configured. Please contact the administrator to set up Algolia search.
            </p>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout
      title="Search - GeoDa"
      description="Search GeoDa documentation, tutorials, and resources"
    >
      <main style={{ padding: '2rem', minHeight: '60vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Search GeoDa Documentation
          </h1>
          <DocSearch
            appId={algoliaConfig.appId}
            apiKey={algoliaConfig.apiKey}
            indexName={algoliaConfig.indexName}
            placeholder="Search for tutorials, documentation, examples..."
            searchParameters={{
              facetFilters: ['type:content'],
            }}
            transformItems={(items) => {
              return items.map((item) => {
                // Transform the URL to remove the base path if needed
                const url = new URL(item.url);
                if (url.pathname.startsWith('/docs/')) {
                  url.pathname = url.pathname.replace('/docs/', '/');
                  item.url = url.toString();
                }
                return item;
              });
            }}
          />
        </div>
      </main>
    </Layout>
  );
} 