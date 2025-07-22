import React from 'react';
import Link from '@docusaurus/Link';
import GlobalLanguageSwitcher from './GlobalLanguageSwitcher';
import GlobalGitHubIcon from './GlobalGitHubIcon';
import styles from './Hero.module.css';

interface HeroProps {
  title: string;
  tagline: string;
  buttons: Array<{
    text: string;
    href: string;
    external?: boolean;
  }>;
}

export default function Hero({ title, tagline, buttons }: HeroProps): React.JSX.Element {
  return (
    <>
      <GlobalLanguageSwitcher />
      <GlobalGitHubIcon />
      <section className={styles.pageHeader}>
        <h1 className={styles.projectName}>{title}</h1>
        <h2 className={styles.projectTagline}>{tagline}</h2>
        <div className={styles.buttonGroup}>
          {buttons.map((button, index) => (
            <Link
              key={index}
              to={button.href}
              className={styles.btn}
              {...(button.external && { target: '_blank', rel: 'noopener noreferrer' })}
            >
              {button.text}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
} 