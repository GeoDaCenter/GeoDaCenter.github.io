# Iframe Dynamic Height Guide

This guide explains the different approaches implemented to make iframes grow their height based on their content.

## Overview

The lab page now supports multiple approaches for dynamic iframe height adjustment:

1. **JavaScript-based Dynamic Height** (Primary approach)
2. **CSS-only Viewport Height** (Fallback)
3. **CSS Aspect Ratio** (Alternative)

## Approach 1: JavaScript-based Dynamic Height (Recommended)

### How it works:
- Uses `postMessage` API to communicate between iframe and parent window
- Automatically detects content height changes
- Provides smooth transitions

### Implementation:
The `lab.tsx` component includes:
- Message event listener for height updates
- Periodic height checking as fallback
- Smooth CSS transitions

### For HTML files in iframes:
Include the `iframe-resizer.js` script in your HTML files:

```html
<script src="/iframe-resizer.js"></script>
```

This script will automatically:
- Send height information on page load
- Monitor content changes
- Send height updates when content changes
- Provide periodic fallback updates

## Approach 2: CSS-only Viewport Height

### Usage:
Add the `viewportHeight` class to the iframe:

```tsx
<iframe 
  className={`${styles.labIframe} ${styles.viewportHeight}`}
  // ... other props
/>
```

### How it works:
- Uses `80vh` (80% of viewport height) on desktop
- Responsive: `70vh` on tablets, `60vh` on mobile
- Provides a reasonable default height

## Approach 3: CSS Aspect Ratio

### Usage:
Add the `aspectRatio` class to the iframe:

```tsx
<iframe 
  className={`${styles.labIframe} ${styles.aspectRatio}`}
  // ... other props
/>
```

### How it works:
- Uses `aspect-ratio: 16 / 9` for consistent proportions
- Good for content with predictable aspect ratios
- Automatically adjusts height based on width

## Configuration Options

### Minimum Heights:
- Desktop: 400px
- Tablet (≤768px): 300px  
- Mobile (≤480px): 250px

### Viewport Heights:
- Desktop: 80vh
- Tablet: 70vh
- Mobile: 60vh

## Best Practices

1. **Use JavaScript approach** when you control the iframe content
2. **Use viewport height** as a fallback for external content
3. **Use aspect ratio** for video or presentation content
4. **Always provide minimum heights** for better UX

## Troubleshooting

### Iframe not resizing:
1. Check if `iframe-resizer.js` is included in the HTML file
2. Verify the iframe content is from the same origin (for direct access)
3. Check browser console for any JavaScript errors

### Cross-origin issues:
- The message-based approach works across origins
- Direct DOM access only works for same-origin iframes
- Use the viewport height fallback for external content

### Performance considerations:
- Height checking is debounced to prevent excessive updates
- Periodic checks run every 2 seconds as fallback
- Smooth transitions prevent jarring height changes

## Example Usage

```tsx
// Dynamic height (default)
<LabContent workbookUrl={labInfo.url} title={labInfo.title} />

// Viewport height fallback
<div className={styles.iframeContainer}>
  <iframe 
    className={`${styles.labIframe} ${styles.viewportHeight}`}
    src={workbookUrl}
    title={title}
  />
</div>

// Aspect ratio for presentations
<div className={styles.iframeContainer}>
  <iframe 
    className={`${styles.labIframe} ${styles.aspectRatio}`}
    src={workbookUrl}
    title={title}
  />
</div>
``` 