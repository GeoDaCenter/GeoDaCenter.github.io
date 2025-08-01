import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'GeoDa',
  tagline: 'An Introduction to Spatial Data Science',
  favicon: 'img/geoda-favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://geodacenter.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'GeoDaCenter', // Usually your GitHub org/user name.
  projectName: 'geoda', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans', 'es', 'de'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      'zh-Hans': {
        label: '中文',
      },
      es: {
        label: 'Español',
      },
      de: {
        label: 'Deutsch',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/GeoDaCenter/geodacenter.github.io/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/GeoDaCenter/geodacenter.github.io/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        googleAnalytics: {
          trackingID: process.env.GOOGLE_ANALYTICS_ID || '',
        },
        gtag: {
          trackingID: process.env.GOOGLE_ANALYTICS_ID || '',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'GeoDa',
      logo: {
        alt: 'GeoDa Logo',
        src: 'img/geoda-official-logo.png',
        srcDark: 'img/geoda-official-logo.png',
      },
      items: [
        {
          href: '/blog',
          label: 'Blog',
          position: 'right',
        },
        {
          href: 'https://GeoDaAI.github.io',
          label: 'GeoDa AI',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/documentation',
            },
            {
              label: 'Download',
              to: '/download',
            },
            {
              label: 'Support',
              to: '/support',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/GeoDaCenter/geoda',
            },
            {
              label: 'Data',
              href: 'https://geodacenter.github.io/data-and-lab/',
            },
            {
              label: 'Contact',
              href: 'mailto:spatial@uchicago.edu',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'Cheat Sheet',
              to: '/cheatsheet',
            },
            {
              label: 'Glossary',
              to: '/glossary',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} GeoDa Center. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
