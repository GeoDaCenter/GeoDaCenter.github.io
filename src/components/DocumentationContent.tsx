import React from 'react';
import styles from './DocumentationContent.module.css';
import { processContentWithLinks } from '../utils/contentProcessor';

interface Link {
  text: string;
  href: string;
  external?: boolean;
}

interface WorkbookItem {
  title: string;
  href: string;
  external?: boolean;
}

interface OverviewItem {
  title: string;
  href: string;
  external?: boolean;
}

interface LegacyItem {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
}

interface DocumentationContentProps {
  intro: {
    title: string;
    content: string[];
    links: Link[];
  };
  workbook: {
    title: string;
    items: WorkbookItem[];
  };
  overview: {
    title: string;
    description: string;
    items: OverviewItem[];
  };
  formats: {
    title: string;
    content: string;
    links: Link[];
  };
  regression: {
    title: string;
    content: string;
    items: OverviewItem[];
  };
  legacy: {
    title: string;
    content: string;
    links: Link[];
    items: LegacyItem[];
  };
}

export default function DocumentationContent({
  intro,
  workbook,
  overview,
  formats,
  regression,
  legacy
}: DocumentationContentProps): React.JSX.Element {
  const openLab = (url: string, title: string) => {
    const labPath = url;  // url.replace('/workbook/', '');
    const labUrl = `./lab?lab=${labPath}&title=${encodeURIComponent(title)}`;
    window.location.href = labUrl;
  };

  return (
    <section className={styles.mainContent}>
      <h3>
        <a id="welcome-to-github-pages" className="anchor" href="#welcome-to-github-pages" aria-hidden="true">
          <span className="octicon octicon-link"></span>
        </a>
      </h3>

      <h3>{intro.title}</h3>

      {intro.content.map((paragraph, index) => (
        <p key={index}>
          {index < intro.links.length 
            ? processContentWithLinks(paragraph, [intro.links[index]])
            : paragraph
          }
        </p>
      ))}

      <ul>
        {workbook.items.map((item, index) => (
          <li key={index}>
            <button 
              className={styles.workbookLink}
              onClick={() => openLab(item.href, item.title)}
            >
              {item.title}
              <span className={styles.modalIcon} title="Opens in embedded page">📖</span>
            </button>
          </li>
        ))}
      </ul>

      <h3>{overview.title}</h3>

      <p>{overview.description}</p>

      <ul>
        {overview.items.map((item, index) => (
          <li key={index}>
            <a 
              href={item.href} 
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>

      <h3>{formats.title}</h3>

      <p>{processContentWithLinks(formats.content, formats.links)}</p>

      <h3>{regression.title}</h3>

      <p>{regression.content}</p>

      <ul>
        {regression.items.map((item, index) => (
          <li key={index}>
            <a 
              href={item.href} 
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>

      <h3>{legacy.title}</h3>

      <p>{processContentWithLinks(legacy.content, legacy.links)}</p>

      <ul>
        {legacy.items.map((item, index) => (
          <li key={index}>
            <a 
              href={item.href} 
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              title={item.title}
            >
              {item.title}
            </a>
            {item.description && ` ${item.description}`}
          </li>
        ))}
      </ul>
    </section>
  );
} 