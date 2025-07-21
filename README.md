# GeoDa Docusaurus Site

This is the new Docusaurus-based website for GeoDa, migrated from the original static HTML site. The site maintains the same visual design and content while providing a modern, maintainable codebase with full internationalization support.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
geodacenter.github.io/
├── src/
│   ├── components/          # React components
│   │   ├── Hero.tsx        # Main hero section
│   │   ├── MainContent.tsx # Main content sections
│   │   ├── Slideshow.tsx   # Image slideshow component
│   │   ├── Dependencies.tsx # Dependencies section
│   │   ├── Footer.tsx      # Footer section
│   │   ├── LanguageSwitcher.tsx # Language switching component
│   │   ├── StandaloneLanguageSwitcher.tsx # Standalone language switcher
│   │   ├── GlobalLanguageSwitcher.tsx # Global language switcher injection
│   │   ├── Root.tsx        # Root component with locale provider
│   │   └── *.module.css    # CSS modules for components
│   ├── pages/              # React pages
│   │   ├── index.tsx       # Homepage
│   │   ├── download.tsx    # Download page (redirect)
│   │   ├── support.tsx     # Support page (redirect)
│   │   ├── cheatsheet.tsx  # Cheat sheet page (redirect)
│   │   ├── documentation.tsx # Documentation page (redirect)
│   │   └── index-cn.tsx    # Chinese homepage (redirect)
│   ├── data/               # Content data files
│   │   ├── *.json          # English content (fallback)
│   │   ├── zh-Hans/        # Chinese translations
│   │   ├── es/             # Spanish translations
│   │   └── de/             # German translations
│   ├── utils/              # Utility functions
│   │   ├── contentLoader.ts # Content loading with fallback
│   │   ├── localeContext.tsx # Locale context provider
│   │   ├── imagePath.ts    # Image path utilities
│   │   └── contentProcessor.ts # Content processing utilities
│   ├── css/
│   │   └── custom.css      # Global styles
│   └── styles/
│       └── common.module.css # Common styles
├── blog/                   # Blog posts
│   ├── *.md               # Blog markdown files
│   ├── authors.yml        # Blog authors
│   └── tags.yml           # Blog tags
├── docs/                   # Documentation (Markdown)
├── static/                 # Static assets
│   ├── img/               # Images (copied from original)
│   ├── data/              # Data files (CSV, JSON)
│   ├── docs/              # Documentation files (PDF)
│   ├── workbook/          # Workbook files
│   ├── *.js               # JavaScript files
│   └── *.css              # CSS files
├── docusaurus.config.ts   # Docusaurus configuration
├── sidebars.ts           # Documentation sidebar
└── package.json          # Dependencies and scripts
```

## 🌍 Internationalization (i18n)

The site supports multiple languages with an enhanced fallback system:

### Supported Languages
- **English** (en) - Default language
- **Chinese Simplified** (zh-Hans) - 中文
- **Spanish** (es) - Español  
- **German** (de) - Deutsch

### Features

1. **Language Switcher**: Global language switcher in the navigation bar
2. **Enhanced Fallback System**: Three-level fallback for missing translations
3. **Content Management**: JSON-based content files for easy translation
4. **URL-based Routing**: Language-specific URLs (e.g., `/zh-Hans/`, `/es/`)

### Fallback System

The enhanced fallback system provides three levels of fallback:

1. **File-level fallback**: If a localized file doesn't exist, use the English version
2. **Deep merge fallback**: Merge localized content with English content, ensuring all properties exist
3. **Property-level fallback**: Access specific properties with automatic fallback to English

### Content Structure

```
src/data/
├── indexContent.json          # English (fallback)
├── siteCommon.json           # English (fallback)
├── zh-Hans/
│   ├── indexContent.json     # Chinese (partial)
│   └── siteCommon.json       # Chinese (partial)
└── es/
    ├── indexContent.json     # Spanish (partial)
    └── siteCommon.json       # Spanish (partial)
```

### Usage Examples

```typescript
import { useLocalizedContent, useLocalizedContentFile, useLocalizedProperty } from '../utils/contentLoader';
import indexContent from '../data/indexContent.json';

// Get entire content with fallback
const content = useLocalizedContentFile('indexContent.json', indexContent);

// Get specific property with fallback
const title = useLocalizedProperty('mainContent.intro.title', indexContent, 'indexContent.json');
```

## 🎨 Design System

The site maintains the original GeoDa design with:

- **Color Scheme**: Green gradient (#155799 to #159957)
- **Typography**: Open Sans font family
- **Layout**: Responsive design with mobile-first approach
- **Components**: Modular React components with CSS modules

### Key Components

1. **Hero Section** (`Hero.tsx`)
   - Main title and tagline
   - Navigation buttons
   - Responsive design
   - Global language switcher integration

2. **Main Content** (`MainContent.tsx`)
   - Feature sections
   - Image galleries
   - Embedded videos

3. **Slideshow** (`Slideshow.tsx`)
   - Interactive image slideshow
   - Uses better-simple-slideshow library
   - Responsive image display

4. **Language Switcher** (`LanguageSwitcher.tsx`)
   - Dropdown language selection
   - Persistent language preference
   - URL-based language detection

5. **Footer** (`Footer.tsx`)
   - Acknowledgments
   - Support information
   - Contact details
   - Donation links

## 🔧 Development

### Available Scripts

- `pnpm start` - Start development server
- `pnpm build` - Build for production
- `pnpm serve` - Serve production build locally

### Adding New Pages

1. Create a new `.tsx` file in `src/pages/`
2. Export a default React component
3. Use the `Layout` component for consistent styling

Example:
```tsx
import React from 'react';
import Layout from '@theme/Layout';

export default function NewPage(): React.JSX.Element {
  return (
    <Layout
      title="Page Title"
      description="Page description"
    >
      <div>
        {/* Your content here */}
      </div>
    </Layout>
  );
}
```

### Adding New Components

1. Create a new `.tsx` file in `src/components/`
2. Create a corresponding `.module.css` file for styles
3. Import and use in pages as needed

### Adding Internationalized Content

1. Create content in `src/data/` as JSON files
2. Add translations in language-specific folders (`zh-Hans/`, `es/`, `de/`)
3. Use the content loader utilities for automatic fallback

### Styling

- Use CSS modules for component-specific styles
- Global styles go in `src/css/custom.css`
- Common styles in `src/styles/common.module.css`
- Follow the existing color scheme and typography
- Ensure responsive design for all components

## 📦 Migration Details

### What Was Migrated

- ✅ All images and static assets
- ✅ CSS styles and layouts
- ✅ Main content and text
- ✅ Navigation structure
- ✅ Google Analytics integration
- ✅ Responsive design
- ✅ Blog functionality
- ✅ Documentation structure

### What Was Improved

- 🔄 Modular React components
- 🔄 TypeScript support
- 🔄 Better development experience
- 🔄 Improved maintainability
- 🔄 Modern build system
- 🔄 Better SEO optimization
- 🔄 Full internationalization support
- 🔄 Enhanced fallback system
- 🔄 Content management system
- 🔄 Language switching functionality

### Temporary Redirects

Some pages currently redirect to the original HTML versions:
- `/download` → `/download.html`
- `/support` → `/support.html`
- `/cheatsheet` → `/cheatsheet.html`
- `/documentation` → `/documentation.html`
- `/index-cn` → `/index-cn.html`

These will be migrated to full Docusaurus pages in future updates.

## 🚀 Deployment

The site is configured for GitHub Pages deployment:

1. Build the site:
   ```bash
   pnpm build
   ```

2. Deploy to GitHub Pages:
   ```bash
   pnpm deploy
   ```

The site will be available at: `https://geodacenter.github.io/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `pnpm start`
5. Test internationalization by switching languages
6. Submit a pull request

### Translation Guidelines

1. **Content Files**: Add translations to the appropriate language folder in `src/data/`
2. **Fallback System**: Use the existing fallback system - missing translations will use English
3. **Testing**: Test with incomplete translations to ensure fallbacks work correctly
4. **Console Warnings**: Monitor console warnings to identify missing translations

## 📄 License

This project is part of the GeoDa project and follows the same licensing terms.

## 🆘 Support

For issues related to this Docusaurus site:
- Check the [Docusaurus documentation](https://docusaurus.io/)
- Review the component structure and styling
- Ensure all dependencies are properly installed
- Check the [FALLBACK_SYSTEM_GUIDE.md](FALLBACK_SYSTEM_GUIDE.md) for internationalization details

For GeoDa software support:
- Visit the [original support page](https://geodacenter.github.io/support.html)
- Contact: spatial@uchicago.edu

## 📚 Additional Documentation

- [FALLBACK_SYSTEM_GUIDE.md](FALLBACK_SYSTEM_GUIDE.md) - Enhanced localization fallback system
- [CSS_OPTIMIZATION_SUMMARY.md](CSS_OPTIMIZATION_SUMMARY.md) - CSS optimization details
- [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) - Migration process summary
