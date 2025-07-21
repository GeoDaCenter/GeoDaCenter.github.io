import React from 'react';
import styles from './MainContent.module.css';
import commonStyles from '../styles/common.module.css';

interface AcknowledgmentsSectionProps {
  title: string;
  content: string;
}

export default function AcknowledgmentsSection({ title, content }: AcknowledgmentsSectionProps): React.JSX.Element {
  return (
    <section className={styles.mainContent}>
      <h3 className={commonStyles.heading}>
        <a
          id="intro-ackn"
          className="anchor"
          href="#intro-ackn"
          aria-hidden="true"
        >
          <span className="octicon octicon-link"></span>
        </a>
        {title}
      </h3>
      <p>{content}</p>
    </section>
  );
} 