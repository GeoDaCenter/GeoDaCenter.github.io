import React from 'react';
import Layout from '@theme/Layout';
import styles from './setup-instruction.module.css';
import commonStyles from '../styles/common.module.css';
import Hero from '../components/Hero';
import SetupInstructionSection from '../components/SetupInstructionSection';
import Root from '../components/Root';
import setupOracleContent from '../data/setupOracleContent.json';
import siteCommon from '../data/siteCommon.json';
import { useLocalizedContent, useLocalizedContentFile } from '../utils/contentLoader';

export default function SetupOracle(): React.JSX.Element {
  return (
    <Root>
      <SetupOracleContent />
    </Root>
  );
}

function SetupOracleContent(): React.JSX.Element {
  const localizedSiteCommon = useLocalizedContent(siteCommon);
  const localizedSetupOracleContent = useLocalizedContentFile('setupOracleContent.json', setupOracleContent);

  return (
    <Layout
      title="Plugins: Setup Oracle | GeoDa on Github"
      description="Setup instructions for Oracle Spatial Database Plugin"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={localizedSetupOracleContent.tagline}
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
              {localizedSetupOracleContent.mainContent.title}
            </h3>

            <div className={styles.navigation}>
              {localizedSetupOracleContent.mainContent.navigation.map((nav, index) => (
                <a key={index} href={nav.href} className={styles.navLink}>
                  {nav.text}
                </a>
              ))}
            </div>

            <hr className={styles.divider} />

            {localizedSetupOracleContent.mainContent.sections.map((section, index) => (
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
