import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import styles from './AnnouncementBanner.module.css';

interface AnnouncementBannerProps {
  text: string;
  url: string;
  date?: string; // MM/DD/YYYY format
}

export default function AnnouncementBanner({ text, url, date }: AnnouncementBannerProps): React.JSX.Element | null {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage for banner visibility
    const lastDismissedDate = localStorage.getItem('announcement-banner-last-dismissed');
    
    // If no date provided, fall back to the old behavior
    if (!date) {
      const bannerHidden = localStorage.getItem('announcement-banner-hidden');
      if (!bannerHidden) {
        setIsVisible(true);
        document.body.style.paddingTop = '60px';
      }
      return;
    }
    
    // Check if this announcement is newer than the last dismissed one
    // Convert MM/DD/YYYY strings to Date objects for proper chronological comparison
    if (!lastDismissedDate || new Date(date) > new Date(lastDismissedDate)) {
      setIsVisible(true);
      document.body.style.paddingTop = '60px';
    }
    
    // Cleanup function to remove padding when component unmounts
    return () => {
      document.body.style.paddingTop = '';
    };
  }, [date]);

  const handleClose = () => {
    setIsVisible(false);
    
    if (date) {
      // Store the date of this announcement as dismissed
      localStorage.setItem('announcement-banner-last-dismissed', date);
    } else {
      // Fall back to the old behavior for backward compatibility
      localStorage.setItem('announcement-banner-hidden', 'true');
    }
    
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