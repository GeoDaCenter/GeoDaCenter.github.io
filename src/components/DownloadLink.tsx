import React from 'react';
import styles from './MainContent.module.css';

interface Tracking {
  category: string;
  label: string;
}

interface DownloadLinkProps {
  text: string;
  href: string;
  tracking?: Tracking;
  external?: boolean;
}

export default function DownloadLink({ text, href, tracking, external = false }: DownloadLinkProps): React.JSX.Element {
  const handleClick = () => {
    if (tracking && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'GeoDaDownload', {
        'event_category': tracking.category,
        'event_label': tracking.label
      });
    }
  };

  return (
    <li>
      <a 
        href={href}
        onClick={handleClick}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={styles.downloadLink}
      >
        {text}
      </a>
    </li>
  );
} 