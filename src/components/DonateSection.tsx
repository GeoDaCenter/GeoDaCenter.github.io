import React from 'react';
import styles from './MainContent.module.css';
import commonStyles from '../styles/common.module.css';
import { processContentWithLinks } from '../utils/contentProcessor';
import { getImagePath } from '../utils/imagePath';

interface Link {
  text: string;
  href: string;
  external?: boolean;
}

interface DonateSectionProps {
  title: string;
  content: string;
  links: Link[];
  image: string;
  imageAlt: string;
}

export default function DonateSection({ title, content, links, image, imageAlt }: DonateSectionProps): React.JSX.Element {
  return (
    <section className={styles.mainContent}>
      <h3 className={commonStyles.heading}>
        <a
          id="intro-donate"
          className="anchor"
          href="#intro-donate"
          aria-hidden="true"
        >
          <span className="octicon octicon-link"></span>
        </a>
        {title}
      </h3>
      <p>
        {processContentWithLinks(content, links)}
      </p>
      {links && links.length > 0 && links[0] && links[0].href && (
        <p>
          <a href={links[0].href}>
            <img src={image} alt={imageAlt} />
          </a>
        </p>
      )}
    </section>
  );
} 