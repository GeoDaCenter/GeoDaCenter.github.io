import React from 'react';
import Layout from '@theme/Layout';
import styles from './setup-instruction.module.css';
import commonStyles from '../styles/common.module.css';
import Hero from '../components/Hero';
import Root from '../components/Root';
import setupPgeoContent from '../data/setupPgeoContent.json';
import siteCommon from '../data/siteCommon.json';
import { getImagePath } from '../utils/imagePath';
import { useLocalizedContent, useLocalizedContentFile } from '../utils/contentLoader';

export default function SetupPgeo(): React.JSX.Element {
  return (
    <Root>
      <SetupPgeoContent />
    </Root>
  );
}

function SetupPgeoContent(): React.JSX.Element {
  const localizedSiteCommon = useLocalizedContent(siteCommon);
  const localizedSetupPgeoContent = useLocalizedContentFile('setupPgeoContent.json', setupPgeoContent);

  return (
    <Layout
      title="Plugins | GeoDa on Github"
      description="Setup instructions for ESRI Personal Geodatabase Plugin"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={localizedSetupPgeoContent.tagline}
          buttons={localizedSiteCommon.hero.buttons}
        />

        <div className={commonStyles.container}>
          <div className={commonStyles.content}>
            <h3 className={styles.mainTitle}>
              <a id="welcome-to-github-pages" className="anchor" href="#welcome-to-github-pages" aria-hidden="true">
                <span className="octicon octicon-link"></span>
              </a>
              {localizedSetupPgeoContent.mainContent.title}
            </h3>

            <div className={styles.description}>
              {localizedSetupPgeoContent.mainContent.description.map((paragraph, index) => (
                <p key={index} className={styles.descriptionText}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className={styles.imageGallery}>
              {localizedSetupPgeoContent.mainContent.images.map((image, index) => (
                <div key={index} className={styles.imageContainer}>
                  <img src={getImagePath(image.src)} alt={image.alt} className={styles.instructionImage} />
                </div>
              ))}
            </div>

          </div>
        </div>

        
      </main>
    </Layout>
  );
} 