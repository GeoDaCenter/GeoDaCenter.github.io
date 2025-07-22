# Navbar Search Duplication Fix

## Problem
The navbar had duplicate search functionality:
1. **Manual Search Item**: A navbar item that linked to `/search` page
2. **Algolia Search Container**: Automatically added by Docusaurus when Algolia is configured

This resulted in two search elements appearing in the navbar.

## Solution
Removed the manual search item from the navbar configuration since Algolia automatically provides a search container.

### Changes Made

1. **Updated `docusaurus.config.ts`**:
   - Removed the manual search item from the navbar items array
   - Kept the Algolia configuration which automatically adds the search container

2. **Cleaned up unused components**:
   - Removed `src/components/CustomNavbar.tsx` (unused)
   - Removed `src/components/SearchBar.tsx` (unused)

### Before
```typescript
items: [
  {
    href: '/blog',
    label: 'Blog',
    position: 'right',
  },
  {
    href: '/search',  // ❌ Manual search item
    label: 'Search',
    position: 'right',
  },
  {
    href: 'https://github.com/GeoDaCenter/geoda',
    label: 'GitHub',
    position: 'right',
  },
],
```

### After
```typescript
items: [
  {
    href: '/blog',
    label: 'Blog',
    position: 'right',
  },
  {
    href: 'https://github.com/GeoDaCenter/geoda',
    label: 'GitHub',
    position: 'right',
  },
],
// ✅ Algolia automatically adds search container
```

## Result
- ✅ Single search functionality in navbar
- ✅ Algolia search container automatically provided
- ✅ Clean navbar without duplication
- ✅ Search page still accessible at `/search`

## How Algolia Search Works
When Algolia is configured in `docusaurus.config.ts`, Docusaurus automatically:
1. Adds a search container to the navbar
2. Provides keyboard shortcuts (Ctrl+K / Cmd+K)
3. Creates a search page at `/search`
4. Handles search functionality across all content

## Note
The search page at `/search` is still available and functional. The fix only removes the duplicate navbar item, not the search functionality itself. 