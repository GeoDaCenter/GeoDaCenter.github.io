import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import styles from './AnnouncementBanner.module.css';

interface AnnouncementBannerProps {
  text: string;
  url: string;
}

export default function AnnouncementBanner({ text, url }: AnnouncementBannerProps): React.JSX.Element | null {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage for banner visibility
    const bannerHidden = localStorage.getItem('announcement-banner-hidden');
    
    if (!bannerHidden) {
      setIsVisible(true);
      document.body.style.paddingTop = '60px';
    }
    
    // Cleanup function to remove padding when component unmounts
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('announcement-banner-hidden', 'true');
    // Remove padding from body when banner is closed
    document.body.style.paddingTop = '';
  };

  if (!isVisible) {
    return null;
  }
  return (
    <div className={styles.banner}>
      <div className={styles.bannerContent}>
        <Link to={url} className={styles.bannerLink}>
          {text}
        </Link>
        <button 
          onClick={handleClose} 
          className={styles.closeButton}
          aria-label="Close announcement"
        >
          ×
        </button>
      </div>
    </div>
  );
} 