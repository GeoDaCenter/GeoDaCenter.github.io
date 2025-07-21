import { useLocale } from './localeContext';

// Helper function to deep merge objects with fallback
function deepMergeWithFallback<T>(localized: T, fallback: T): T {
  if (localized === null || localized === undefined) {
    return fallback;
  }
  
  if (typeof localized !== 'object' || typeof fallback !== 'object') {
    return localized !== undefined ? localized : fallback;
  }
  
  if (Array.isArray(localized)) {
    if (!Array.isArray(fallback)) {
      return localized;
    }
    // For arrays, use localized if it exists, otherwise fallback
    return localized.length > 0 ? localized : fallback;
  }
  
  const result = { ...fallback } as any;
  
  for (const key in localized) {
    if (localized.hasOwnProperty(key)) {
      if (fallback && fallback.hasOwnProperty(key)) {
        result[key] = deepMergeWithFallback(localized[key], fallback[key]);
      } else {
        result[key] = localized[key];
      }
    }
  }
  
  return result as T;
}

export function useLocalizedContent<T>(defaultContent: T): T {
  const { currentLocale } = useLocale();
  console.log('Current locale from custom context:', currentLocale);
  
  if (currentLocale === 'en') {
    return defaultContent;
  }
  
  try {
    // Dynamic import for localized content
    const localizedModule = require(`../data/${currentLocale}/siteCommon.json`);
    // Merge with fallback to ensure all properties exist
    const mergedContent = deepMergeWithFallback(localizedModule, defaultContent);
    return mergedContent as T;
  } catch (error) {
    // Fallback to default content if localized version doesn't exist
    console.warn(`Localized content not found for locale: ${currentLocale}, falling back to English`);
    return defaultContent;
  }
}

export function useLocalizedContentFile<T>(fileName: string, defaultContent: T): T {
  const { currentLocale } = useLocale();
  
  console.log(`useLocalizedContentFile - Current locale: ${currentLocale}, File: ${fileName}`);
  
  if (currentLocale === 'en') {
    console.log(`useLocalizedContentFile - Using English content for ${fileName}`);
    return defaultContent;
  }
  
  try {
    // Dynamic import for localized content
    const localizedModule = require(`../data/${currentLocale}/${fileName}`);
    console.log(`useLocalizedContentFile - Successfully loaded ${currentLocale}/${fileName}:`, localizedModule);
    
    // Merge with fallback to ensure all properties exist
    const mergedContent = deepMergeWithFallback(localizedModule, defaultContent);
    console.log(`useLocalizedContentFile - Merged content for ${fileName}:`, mergedContent);
    return mergedContent as T;
  } catch (error) {
    // Fallback to default content if localized version doesn't exist
    console.warn(`Localized content not found for locale: ${currentLocale}, file: ${fileName}, falling back to English. Error:`, error);
    return defaultContent;
  }
}

// New function for more granular property access with fallback
export function useLocalizedProperty<T>(
  propertyPath: string,
  defaultContent: any,
  fileName?: string
): T {
  const { currentLocale } = useLocale();
  
  if (currentLocale === 'en') {
    return getNestedProperty(defaultContent, propertyPath);
  }
  
  try {
    const fileToLoad = fileName || 'siteCommon.json';
    const localizedModule = require(`../data/${currentLocale}/${fileToLoad}`);
    
    // Try to get the property from localized content
    const localizedValue = getNestedProperty(localizedModule, propertyPath);
    const fallbackValue = getNestedProperty(defaultContent, propertyPath);
    
    // Return localized value if it exists and is not undefined/null, otherwise fallback
    if (localizedValue !== undefined && localizedValue !== null) {
      return localizedValue;
    } else {
      console.warn(`Property ${propertyPath} not found in ${currentLocale}/${fileToLoad}, using English fallback`);
      return fallbackValue;
    }
  } catch (error) {
    console.warn(`Localized content not found for locale: ${currentLocale}, file: ${fileName || 'siteCommon.json'}, falling back to English`);
    return getNestedProperty(defaultContent, propertyPath);
  }
}

// Helper function to get nested properties using dot notation
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
} 