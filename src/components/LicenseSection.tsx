import React from 'react';
import styles from './MainContent.module.css';
import commonStyles from '../styles/common.module.css';
import { processContentWithLinks } from '../utils/contentProcessor';

interface Link {
  text: string;
  href: string;
  external?: boolean;
}

interface LicenseSectionProps {
  title: string;
  content: string;
  links: Link[];
}

export default function LicenseSection({ title, content, links }: LicenseSectionProps): React.JSX.Element {
  return (
    <section className={styles.mainContent}>
      <h3 className={commonStyles.heading}>
        <a
          id="intro-license"
          className="anchor"
          href="#intro-license"
          aria-hidden="true"
        >
          <span className="octicon octicon-link"></span>
        </a>
        {title}
      </h3>
      <p>
        {processContentWithLinks(content, links)}
      </p>
    </section>
  );
} 