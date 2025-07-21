import React from 'react';
import Layout from '@theme/Layout';
import styles from './download.module.css';
import commonStyles from '../styles/common.module.css';
import Hero from '../components/Hero';
import DownloadLink from '../components/DownloadLink';
import VersionSection from '../components/VersionSection';
import Root from '../components/Root';
import downloadLinux from '../data/downloadLinux.json';
import siteCommon from '../data/siteCommon.json';
import { useLocalizedContent, useLocalizedContentFile } from '../utils/contentLoader';

export default function DownloadLinux(): React.JSX.Element {
  return (
    <Root>
      <DownloadLinuxContent />
    </Root>
  );
}

function DownloadLinuxContent(): React.JSX.Element {
  const localizedSiteCommon = useLocalizedContent(siteCommon);
  const localizedDownloadLinux = useLocalizedContentFile('downloadLinux.json', downloadLinux);

  return (
    <Layout
      title="Download GeoDa for Linux"
      description="Download GeoDa for Linux - An Introduction to Spatial Data Science"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={localizedDownloadLinux.title}
          buttons={localizedSiteCommon.hero.buttons}
        />

        <div className={commonStyles.container}>
          <div className={commonStyles.content}>
            <section className={styles.mainContent}>
              <h3 className={commonStyles.heading}>
                {localizedDownloadLinux.title}
              </h3>
              
              <p>
                {localizedDownloadLinux.description}
              </p>

              <VersionSection
                version={localizedDownloadLinux.currentVersion.version}
                downloads={localizedDownloadLinux.currentVersion.downloads}
              />

              <div className={styles.alternativeDownloads}>
                <p>
                  {localizedDownloadLinux.alternativeDownloads.title}
                </p>
                <ul className={styles.downloadList}>
                  {localizedDownloadLinux.alternativeDownloads.downloads.map((download, index) => (
                    <DownloadLink
                      key={index}
                      text={download.text}
                      href={download.href}
                      tracking={download.tracking}
                    />
                  ))}
                </ul>
              </div>

              {localizedDownloadLinux.notes.map((note, index) => (
                <div key={index} className={styles.noteSection}>
                  <h4 className={commonStyles.heading}>{note.title}</h4>
                  <p>{note.content}</p>
                  {note.commands && (
                    <div className={styles.commandBlock}>
                      {note.commands.map((command, cmdIndex) => (
                        <div key={cmdIndex} className={styles.commandLine}>
                          {command}
                        </div>
                      ))}
                    </div>
                  )}
                  {note.buildInfo && (
                    <p>
                      {note.buildInfo}
                    </p>
                  )}
                </div>
              ))}

              <h3 className={commonStyles.heading}>Previous Versions</h3>
              {localizedDownloadLinux.previousVersions.map((version, index) => (
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