import React from 'react';
import styles from './MainContent.module.css';
import commonStyles from '../styles/common.module.css';
import { processContentWithLinks } from '../utils/contentProcessor';

interface Link {
  text: string;
  href: string;
  external?: boolean;
}

interface DonationSectionProps {
  title: string;
  content: string;
  links: Link[];
  image: string;
  imageAlt: string;
  description: string;
  descriptionLinks: Link[];
}

export default function DonationSection({ 
  title, 
  content, 
  links, 
  image, 
  imageAlt, 
  description, 
  descriptionLinks 
}: DonationSectionProps): React.JSX.Element {
  return (
    <section className={styles.mainContent}>
      <h3 className={commonStyles.heading}>{title}</h3>
      
      <div style={{ float: 'right', marginLeft: '25px', height: '250px' }}>
        <a href={links[0].href}>
          <img src={image} alt={imageAlt} />
        </a>
      </div>
      
      <p>
        {processContentWithLinks(content, links)}
      </p>
      
      <p>
        {processContentWithLinks(description, descriptionLinks)}
      </p>
    </section>
  );
} 