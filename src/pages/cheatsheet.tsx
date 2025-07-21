import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './cheatsheet.module.css';
import commonStyles from '../styles/common.module.css';
import Hero from '../components/Hero';
import Root from '../components/Root';
import siteCommon from '../data/siteCommon.json';
import { useLocalizedContent } from '../utils/contentLoader';

export default function Cheatsheet(): React.JSX.Element {
  return (
    <Root>
      <CheatsheetContent />
    </Root>
  );
}

function CheatsheetContent(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const localizedSiteCommon = useLocalizedContent(siteCommon);

  return (
    <Layout
      title="Cheat Sheet - GeoDa"
      description="GeoDa Cheat Sheet - Quick reference for spatial data analysis"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline="GeoDa Cheat Sheet"
          buttons={localizedSiteCommon.hero.buttons}
        />

        <div className={commonStyles.container}>
          <div className={commonStyles.content}>
            <p className={styles.cheatsheetDescription}>
              Navigate GeoDa's functionality with this cheat sheet.
              The dots indicate the number of variables used in each tool.
              Icons and labels link to tutorials for more information.
            </p>

            <div className={styles.cheatsheetContainer}>
              <iframe
                src="https://docs.google.com/presentation/d/e/2PACX-1vSfER3ejdJ9heJx_6fYcAnNX-RE8x56Ql7LsPUIsseHOi8c4jHUdpJxcy4tatFhJbGOWyB_BraBiamA/embed?start=false&loop=false&delayms=3000"
                frameBorder="0"
                width="890"
                height="919"
                allowfullscreen="true"
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
