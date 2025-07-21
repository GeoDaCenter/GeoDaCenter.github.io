import React from 'react';
import styles from './MainContent.module.css';
import commonStyles from '../styles/common.module.css';

interface LabInstallationProps {
  title: string;
  description: string;
  text: string;
  href: string;
}

export default function LabInstallation({ title, description, text, href }: LabInstallationProps): React.JSX.Element {
  return (
    <section className={styles.mainContent}>
      <h3 className={commonStyles.heading}>{title}</h3>

      <p>
        {description}
      </p>

      <p>
        <a href={href} className={`btn lab-btn`}>
          {text}
        </a>
      </p>
    </section>
  );
} 