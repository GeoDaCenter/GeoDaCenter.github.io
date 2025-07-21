import React from 'react';
import styles from './MainContent.module.css';
import commonStyles from '../styles/common.module.css';
import { processContentWithLinks } from '../utils/contentProcessor';

interface Link {
  text: string;
  href: string;
  external?: boolean;
}

interface SupportSectionProps {
  title: string;
  content: string;
  links: Link[];
}

export default function SupportSection({ title, content, links }: SupportSectionProps): React.JSX.Element {
  return (
    <section className={styles.mainContent}>
      <h3 className={commonStyles.heading}>
        <a
          id="intro-support"
          className="anchor"
          href="#intro-support"
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