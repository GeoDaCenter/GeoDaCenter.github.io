import React from 'react';
import Layout from '@theme/Layout';
import styles from './setup-instruction.module.css';
import commonStyles from '../styles/common.module.css';
import Hero from '../components/Hero';
import SetupInstructionSection from '../components/SetupInstructionSection';
import Root from '../components/Root';
import setupArcsdeContent from '../data/setupArcsdeContent.json';
import siteCommon from '../data/siteCommon.json';
import { useLocalizedContent, useLocalizedContentFile } from '../utils/contentLoader';

export default function SetupArcSDE(): React.JSX.Element {
  return (
    <Root>
      <SetupArcSDEContent />
    </Root>
  );
}

function SetupArcSDEContent(): React.JSX.Element {
  const localizedSiteCommon = useLocalizedContent(siteCommon);
  const localizedSetupArcsdeContent = useLocalizedContentFile('setupArcsdeContent.json', setupArcsdeContent);

  return (
    <Layout
      title="Plugins: Setup ArcSDE | GeoDa on Github"
      description="Setup instructions for ESRI ArcSDE Plugin"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={localizedSetupArcsdeContent.tagline}
          buttons={localizedSiteCommon.hero.buttons}
        />

        <div className={commonStyles.container}>
          <div className={commonStyles.content}>
            <h3 className={styles.mainTitle}>
              <a
                id="welcome-to-github-pages"
                className="anchor"
                href="#welcome-to-github-pages"
                aria-hidden="true"
              >
                <span className="octicon octicon-link"></span>
              </a>
              {localizedSetupArcsdeContent.mainContent.title}
            </h3>

            <div className={styles.navigation}>
              {localizedSetupArcsdeContent.mainContent.navigation.map((nav, index) => (
                <a key={index} href={nav.href} className={styles.navLink}>
                  {nav.text}
                </a>
              ))}
            </div>

            <hr className={styles.divider} />

            {localizedSetupArcsdeContent.mainContent.sections.map((section, index) => (
              <SetupInstructionSection
                key={index}
                id={section.id}
                title={section.title}
                steps={section.steps}
                image={section.image}
                imageAlt={section.imageAlt}
                commandBlock={section.commandBlock}
              />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
