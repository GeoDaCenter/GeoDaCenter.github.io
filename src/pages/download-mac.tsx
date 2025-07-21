import React from 'react';
import Layout from '@theme/Layout';
import styles from './download.module.css';
import commonStyles from '../styles/common.module.css';
import Hero from '../components/Hero';
import DownloadLink from '../components/DownloadLink';
import VersionSection from '../components/VersionSection';
import Root from '../components/Root';
import downloadMac from '../data/downloadMac.json';
import siteCommon from '../data/siteCommon.json';
import { useLocalizedContent, useLocalizedContentFile } from '../utils/contentLoader';

export default function DownloadMac(): React.JSX.Element {
  return (
    <Root>
      <DownloadMacContent />
    </Root>
  );
}

function DownloadMacContent(): React.JSX.Element {
  const localizedSiteCommon = useLocalizedContent(siteCommon);
  const localizedDownloadMac = useLocalizedContentFile('downloadMac.json', downloadMac);

  return (
    <Layout
      title="Download GeoDa for Mac"
      description="Download GeoDa for Mac OSX - An Introduction to Spatial Data Science"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={localizedDownloadMac.title}
          buttons={localizedSiteCommon.hero.buttons}
        />

        <div className={commonStyles.container}>
          <div className={commonStyles.content}>
            <section className={styles.mainContent}>
              <h3 className={commonStyles.heading}>
                {localizedDownloadMac.title}
              </h3>
              
              <p>
                {localizedDownloadMac.description}
              </p>

              <VersionSection
                version={localizedDownloadMac.currentVersion.version}
                downloads={localizedDownloadMac.currentVersion.downloads}
              />

              <div className={styles.alternativeDownloads}>
                <p>
                  {localizedDownloadMac.alternativeDownloads.title}
                </p>
                <ul className={styles.downloadList}>
                  {localizedDownloadMac.alternativeDownloads.downloads.map((download, index) => (
                    <DownloadLink
                      key={index}
                      text={download.text}
                      href={download.href}
                      tracking={download.tracking}
                    />
                  ))}
                </ul>
              </div>

              {localizedDownloadMac.notes.map((note, index) => (
                <div key={index} className={styles.noteSection}>
                  <h4 className={commonStyles.heading}>{note.title}</h4>
                  <p>{note.content}</p>
                  {note.instructions && (
                    <p>{note.instructions}</p>
                  )}
                </div>
              ))}

              <h3 className={commonStyles.heading}>Previous versions</h3>
              {localizedDownloadMac.previousVersions.map((version, index) => (
                <VersionSection
                  key={index}
                  version={version.version}
                  downloads={version.downloads}
                />
              ))}
            </section>

            
          </div>
        </div>

        
      </main>
    </Layout>
  );
} 