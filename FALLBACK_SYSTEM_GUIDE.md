# Enhanced Localization Fallback System

This guide explains the enhanced fallback system that automatically uses English content when Chinese or Spanish translations are missing.

## Overview

The enhanced fallback system provides three levels of fallback:

1. **File-level fallback**: If a localized file doesn't exist, use the English version
2. **Deep merge fallback**: Merge localized content with English content, ensuring all properties exist
3. **Property-level fallback**: Access specific properties with automatic fallback to English

## How It Works

### 1. Deep Merge Fallback (Enhanced)

The existing `useLocalizedContent` and `useLocalizedContentFile` functions now use deep merging:

```typescript
// Before: Only file-level fallback
const content = useLocalizedContentFile('indexContent.json', defaultContent);

// After: Deep merge with English fallback
const content = useLocalizedContentFile('indexContent.json', defaultContent);
// Now all properties from English are available, even if missing in Chinese/Spanish
```

**Example**: If the Chinese `indexContent.json` is missing the `mainContent.sections` array, the merged content will include the English sections.

### 2. Property-Level Fallback (New)

The new `useLocalizedProperty` function allows accessing specific properties with automatic fallback:

```typescript
import { useLocalizedProperty } from '../utils/contentLoader';

// Access a specific property with fallback
const title = useLocalizedProperty<string>(
  'mainContent.intro.title',
  indexContent,
  'indexContent.json'
);

// Access nested properties
const sectionTitle = useLocalizedProperty<string>(
  'mainContent.sections.0.title',
  indexContent,
  'indexContent.json'
);

// Access array properties
const sectionsCount = useLocalizedProperty<number>(
  'mainContent.sections.length',
  indexContent,
  'indexContent.json'
);
```

## Usage Examples

### Basic Usage

```typescript
import { useLocalizedContentFile, useLocalizedProperty } from '../utils/contentLoader';
import indexContent from '../data/indexContent.json';

function MyComponent() {
  // Get entire content with fallback
  const content = useLocalizedContentFile('indexContent.json', indexContent);
  
  // Get specific property with fallback
  const title = useLocalizedProperty('mainContent.intro.title', indexContent, 'indexContent.json');
  
  return (
    <div>
      <h1>{title}</h1>
      <p>{content.mainContent.intro.content[0]}</p>
    </div>
  );
}
```

### Advanced Usage

```typescript
function AdvancedComponent() {
  // Access deeply nested properties
  const firstSectionTitle = useLocalizedProperty(
    'mainContent.sections.0.title',
    indexContent,
    'indexContent.json'
  );
  
  // Access array properties
  const sectionsCount = useLocalizedProperty(
    'mainContent.sections.length',
    indexContent,
    'indexContent.json'
  );
  
  // Access properties that might not exist in localized version
  const donateTitle = useLocalizedProperty(
    'donate.title',
    indexContent,
    'indexContent.json'
  );
  
  return (
    <div>
      <h2>First Section: {firstSectionTitle}</h2>
      <p>Total Sections: {sectionsCount}</p>
      <p>Donate Title: {donateTitle}</p>
    </div>
  );
}
```

## Property Path Syntax

The `useLocalizedProperty` function uses dot notation to access nested properties:

- `'mainContent.intro.title'` - Access nested object properties
- `'mainContent.sections.0.title'` - Access array elements (0-based index)
- `'mainContent.sections.length'` - Access array properties
- `'donate.links.0.text'` - Access nested array elements

## Console Warnings

The system provides helpful console warnings when fallbacks are used:

```
Property mainContent.sections.0.title not found in zh-Hans/indexContent.json, using English fallback
Localized content not found for locale: zh-Hans, file: missingFile.json, falling back to English
```

These warnings help developers identify missing translations.

## Migration Guide

### For Existing Code

Existing code using `useLocalizedContent` and `useLocalizedContentFile` will automatically benefit from the enhanced fallback system. No changes are required.

### For New Code

Consider using `useLocalizedProperty` for specific property access:

```typescript
// Instead of this:
const content = useLocalizedContentFile('indexContent.json', indexContent);
const title = content.mainContent.intro.title;

// Consider this for better performance:
const title = useLocalizedProperty('mainContent.intro.title', indexContent, 'indexContent.json');
```

## Benefits

1. **Graceful Degradation**: Missing translations don't break the UI
2. **Incremental Translation**: You can translate content piece by piece
3. **Better User Experience**: Users always see content, even if partially in English
4. **Developer Friendly**: Clear warnings help identify missing translations
5. **Performance**: Property-level access can be more efficient than loading entire files

## Testing

You can test the fallback system by:

1. Visiting `/fallback-demo` to see the demonstration page
2. Switching between languages to see how fallbacks work
3. Checking the browser console for fallback warnings
4. Comparing content between English and localized versions

## Best Practices

1. **Use property-level access** for frequently accessed properties
2. **Monitor console warnings** to identify missing translations
3. **Test with incomplete translations** to ensure fallbacks work correctly
4. **Document missing translations** for future translation work
5. **Consider performance** when choosing between file-level and property-level access

## File Structure

The system expects this file structure:

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

Missing properties in Chinese/Spanish files will automatically fall back to English. 