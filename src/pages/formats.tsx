import React from 'react';
import Layout from '@theme/Layout';
import Hero from '../components/Hero';
import FormatsTable from '../components/FormatsTable';
import Root from '../components/Root';
import formatsContent from '../data/formatsContent.json';
import styles from './formats.module.css';
import siteCommon from '../data/siteCommon.json';
import { useLocalizedContent, useLocalizedContentFile } from '../utils/contentLoader';

export default function Formats(): React.JSX.Element {
  return (
    <Root>
      <FormatsContent />
    </Root>
  );
}

function FormatsContent(): React.JSX.Element {
  const localizedSiteCommon = useLocalizedContent(siteCommon);
  const localizedFormatsContent = useLocalizedContentFile('formatsContent.json', formatsContent);

  return (
    <Layout
      title="Data Formats | GeoDa on Github"
      description="Spatial data formats supported by GeoDa 1.8"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={localizedFormatsContent.tagline}
          buttons={localizedSiteCommon.hero.buttons}
        />

        <section className={styles.mainContent}>
          <h3>
            <a
              id="welcome-to-github-pages"
              className="anchor"
              href="#welcome-to-github-pages"
              aria-hidden="true"
            >
              <span className="octicon octicon-link"></span>
            </a>
            {localizedFormatsContent.mainContent.title}
          </h3>

          {localizedFormatsContent.mainContent.sections.map((section, index) => (
            <FormatsTable
              key={index}
              title={section.title}
              headers={section.headers}
              rows={section.rows as (string | { text: string; href: string; })[][]}
            />
          ))}
        </section>
      </main>
    </Layout>
  );
}
