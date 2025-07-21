import React from 'react';
import Layout from '@theme/Layout';
import Hero from '../components/Hero';
import DocumentationContent from '../components/DocumentationContent';
import Root from '../components/Root';
import documentationContent from '../data/documentationContent.json';
import siteCommon from '../data/siteCommon.json';
import { useLocalizedContent, useLocalizedContentFile } from '../utils/contentLoader';

export default function Documentation(): React.JSX.Element {
  return (
    <Root>
      <DocumentationPageContent />
    </Root>
  );
}

function DocumentationPageContent(): React.JSX.Element {
  const localizedSiteCommon = useLocalizedContent(siteCommon);
  const localizedDocumentationContent = useLocalizedContentFile('documentationContent.json', documentationContent);

  return (
    <Layout
      title="Documentation - GeoDa"
      description="GeoDa Documentation - Learn how to use GeoDa for spatial data analysis"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={localizedDocumentationContent.tagline}
          buttons={localizedSiteCommon.hero.buttons}
        />

        <DocumentationContent
          intro={localizedDocumentationContent.mainContent.intro}
          workbook={localizedDocumentationContent.mainContent.workbook}
          overview={localizedDocumentationContent.mainContent.overview}
          formats={localizedDocumentationContent.mainContent.formats}
          regression={localizedDocumentationContent.mainContent.regression}
          legacy={localizedDocumentationContent.mainContent.legacy}
        />
      </main>
    </Layout>
  );
}
