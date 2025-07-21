import React from 'react';
import styles from './MainContent.module.css';
import commonStyles from '../styles/common.module.css';
import DownloadLink from './DownloadLink';

interface Download {
  text: string;
  href: string;
  tracking?: {
    category: string;
    label: string;
  };
}

interface VersionSectionProps {
  version: string;
  downloads: Download[];
  content?: string;
  notes?: string[];
}

export default function VersionSection({ version, downloads, content, notes }: VersionSectionProps): React.JSX.Element {
  return (
    <div className={styles.versionSection}>
      <h4 className={commonStyles.heading}>{version}</h4>
      {content && (
        <p>{content}</p>
      )}
      {notes && (
        <ul className={styles.noteList}>
          {notes.map((note, index) => (
            <li key={index} className={commonStyles.text}>{note}</li>
          ))}
        </ul>
      )}
      <ul className={styles.downloadList}>
        {downloads.map((download, index) => (
          <DownloadLink
            key={index}
            text={download.text}
            href={download.href}
            tracking={download.tracking}
          />
        ))}
      </ul>
    </div>
  );
} 