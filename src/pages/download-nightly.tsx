import React from 'react';
import Layout from '@theme/Layout';
import styles from './download.module.css';
import commonStyles from '../styles/common.module.css';
import Hero from '../components/Hero';
import DownloadLink from '../components/DownloadLink';
import Root from '../components/Root';
import downloadNightly from '../data/downloadNightly.json';
import siteCommon from '../data/siteCommon.json';
import { useLocalizedContent, useLocalizedContentFile } from '../utils/contentLoader';

export default function DownloadNightly(): React.JSX.Element {
  return (
    <Root>
      <DownloadNightlyContent />
    </Root>
  );
}

function DownloadNightlyContent(): React.JSX.Element {
  const localizedSiteCommon = useLocalizedContent(siteCommon);
  const localizedDownloadNightly = useLocalizedContentFile('downloadNightly.json', downloadNightly);

  return (
    <Layout
      title="Download GeoDa Nightly Build"
      description="Download GeoDa Nightly Build - An Introduction to Spatial Data Science"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={localizedDownloadNightly.title}
          buttons={localizedSiteCommon.hero.buttons}
        />

        <div className={commonStyles.container}>
          <div className={commonStyles.content}>
            <section className={styles.mainContent}>
              <h3 className={commonStyles.heading}>
                {localizedDownloadNightly.title}
              </h3>
              
              {localizedDownloadNightly.releases.map((release, index) => (
                <div key={index} className={styles.releaseSection}>
                  <h4 className={commonStyles.heading}>
                    {release.date} {release.version}
                  </h4>
                  
                  {release.releaseNotes && (
                    <p>
                      <a 
                        href={release.releaseNotes}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.releaseNotesLink}
                      >
                        Release notes
                      </a>
                    </p>
                  )}
                  
                  {release.downloads && (
                    <ul className={styles.downloadList}>
                      {release.downloads.map((download, downloadIndex) => (
                        <DownloadLink
                          key={downloadIndex}
                          text={download.text}
                          href={download.href}
                          tracking={download.tracking}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>

            
          </div>
        </div>

        
      </main>
    </Layout>
  );
} 