import React from 'react';
import styles from './Dependencies.module.css';

interface DependencyItem {
  name: string;
  license: string;
  authors: string;
  link: string;
  note?: string;
}

interface DependenciesProps {
  title: string;
  description: string;
  items: DependencyItem[];
}

export default function Dependencies({ title, description, items }: DependenciesProps): React.JSX.Element {
  return (
    <section className={styles.mainContent}>
      <h3>
        <a id="dependencies" className="anchor" href="#dependencies" aria-hidden="true">
          <span className="octicon octicon-link"></span>
        </a>
        {title}
      </h3>

      <p>{description}</p>

      <div className={styles.dependenciesList}>
        {items.map((item, index) => (
          <div key={index} className={styles.dependencyItem}>
            <p>
              <strong>{item.name}</strong><br />
              License: {item.license}<br />
              Authors: {item.authors}<br />
              {item.note && (
                <>
                  Note: {item.note}<br />
                </>
              )}
              Links: <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
} 