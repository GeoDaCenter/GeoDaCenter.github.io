import React from 'react';
import styles from './MainContent.module.css';
import commonStyles from '../styles/common.module.css';
import { processContentWithLinks } from '../utils/contentProcessor';

interface Release {
  date: string;
  version: string;
}

interface Link {
  text: string;
  href: string;
  external?: boolean;
}

interface ReleaseListProps {
  title: string;
  releaseNotesLink: Link;
  releases: Release[];
}

export default function ReleaseList({ title, releaseNotesLink, releases }: ReleaseListProps): React.JSX.Element {
  return (
    <section className={styles.mainContent}>
      <h3 className={commonStyles.heading}>{title}</h3>
      <p>
        {processContentWithLinks(`(${releaseNotesLink.text})`, [
          releaseNotesLink,
        ])}
      </p>
      {releases.map((release, index) => (
        <div key={index} className={styles.releaseItem}>
          {release.date} subversion {release.version}
        </div>
      ))}
    </section>
  );
} 