import React from 'react';
import styles from './MainContent.module.css';

interface Button {
  text: string;
  href: string;
}

interface DownloadButtonsProps {
  buttons: Button[];
}

export default function DownloadButtons({
  buttons,
}: DownloadButtonsProps): React.JSX.Element {
  return (
    <section className={styles.mainContent}>
      <br />
      <p style={{ textAlign: 'center' }}>
        {buttons.map((button, index) => (
          <a
            key={index}
            href={button.href}
            className={`btn ${index === 3 ? 'nightly-btn' : 'download-btn'}`}
          >
            {button.text}
          </a>
        ))}
      </p>
      <br />
    </section>
  );
}
