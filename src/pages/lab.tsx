import React, { useEffect, useState, useRef } from 'react';
import Layout from '@theme/Layout';
import styles from './lab.module.css';
import Hero from '../components/Hero';
import Root from '../components/Root';
import siteCommon from '../data/siteCommon.json';
import { useLocalizedContent } from '../utils/contentLoader';

interface LabContentProps {
  workbookUrl: string;
  title: string;
}

function LabContent({ workbookUrl, title }: LabContentProps): React.JSX.Element {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(600);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the same origin or trusted sources
      if (event.origin !== window.location.origin && 
          !workbookUrl.includes(event.origin)) {
        return;
      }

      // Check if the message contains height information
      if (event.data && typeof event.data === 'object' && event.data.type === 'resize') {
        const newHeight = event.data.height;
        if (typeof newHeight === 'number' && newHeight > 0) {
          setIframeHeight(newHeight);
        }
      }
    };

    // Listen for messages from iframe
    window.addEventListener('message', handleMessage);

    // Set up a fallback timer to check iframe height periodically
    const checkHeight = () => {
      if (iframeRef.current) {
        try {
          // Try to access iframe content (only works if same origin)
          const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
          if (iframeDoc) {
            const scrollHeight = iframeDoc.documentElement.scrollHeight || iframeDoc.body.scrollHeight;
            if (scrollHeight > 0 && scrollHeight !== iframeHeight) {
              setIframeHeight(scrollHeight);
            }
          }
        } catch (error) {
          // Cross-origin iframe, can't access content directly
          // The message-based approach will handle this
        }
      }
    };

    const heightCheckInterval = setInterval(checkHeight, 1000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(heightCheckInterval);
    };
  }, [workbookUrl, iframeHeight]);

  return (
    <div className={styles.labContainer}>
      <div className={styles.iframeContainer}>
        <iframe
          ref={iframeRef}
          src={workbookUrl}
          title={title}
          className={styles.labIframe}
          style={{ height: `${iframeHeight}px` }}
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function Lab(): React.JSX.Element {
  return (
    <Root>
      <LabPageContent />
    </Root>
  );
}

function LabPageContent(): React.JSX.Element {
  const [labInfo, setLabInfo] = useState<{
    title: string;
    url: string;
  }>({
    title: 'GeoDa Workbook',
    url: ''
  });

  const localizedSiteCommon = useLocalizedContent(siteCommon);

  useEffect(() => {
    // Get lab info from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const labPath = urlParams.get('lab');
    const labTitle = urlParams.get('title') || 'GeoDa Workbook';

    // Construct the correct path for both development and production
    // In production, we need to use absolute path from the site root
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? '/newsite' 
      : '.';
    
    // Use provided lab path or default to the first lab
    const finalLabPath = labPath || './workbook/01_datawrangling_1/lab1a.html';
    
    setLabInfo({
      title: labTitle,
      url: `${baseUrl}/${finalLabPath}`
    });
  }, []);

  return (
    <Layout
      title={`${labInfo.title} - GeoDa`}
      description={`${labInfo.title} - GeoDa Workbook and Tutorial`}
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={labInfo.title}
          buttons={localizedSiteCommon.hero.buttons}
        />

        <LabContent 
          workbookUrl={labInfo.url}
          title={labInfo.title}
        />
      </main>
    </Layout>
  );
} 