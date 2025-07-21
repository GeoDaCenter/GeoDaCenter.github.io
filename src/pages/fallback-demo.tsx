import React from 'react';
import Layout from '@theme/Layout';
import FallbackExample from '../components/FallbackExample';
import Root from '../components/Root';
import siteCommon from '../data/siteCommon.json';
import { useLocalizedContent } from '../utils/contentLoader';

export default function FallbackDemo(): React.JSX.Element {
  return (
    <Root>
      <FallbackDemoContent />
    </Root>
  );
}

function FallbackDemoContent(): React.JSX.Element {
  const localizedSiteCommon = useLocalizedContent(siteCommon);
  
  return (
    <Layout
      title="Fallback System Demo - GeoDa"
      description="Demonstration of the enhanced localization fallback system"
    >
      <main>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '40px 20px', 
          textAlign: 'center',
          borderBottom: '1px solid #dee2e6'
        }}>
          <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>
            {localizedSiteCommon.hero.title}
          </h1>
          <p style={{ margin: '0', fontSize: '1.2rem', color: '#666' }}>
            Fallback System Demonstration
          </p>
        </div>
        
        <FallbackExample />
      </main>
    </Layout>
  );
} 