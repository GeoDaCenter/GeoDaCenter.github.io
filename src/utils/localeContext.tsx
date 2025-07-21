import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from '@docusaurus/router';

interface LocaleContextType {
  currentLocale: string;
  setCurrentLocale: (locale: string) => void;
  locales: Array<{ code: string; label: string }>;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

// Helper function to safely access localStorage
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(key);
  }
  return null;
};

// Helper function to safely set localStorage
const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(key, value);
  }
};

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const location = useLocation();
  
  // Initialize from localStorage or default to 'en'
  const getInitialLocale = () => {
    const savedLocale = getLocalStorageItem('preferredLanguage');
    console.log(`LocaleProvider - Initializing locale. Saved locale: ${savedLocale}`);
    if (savedLocale && ['en', 'zh-Hans', 'es', 'de'].includes(savedLocale)) {
      console.log(`LocaleProvider - Using saved locale: ${savedLocale}`);
      return savedLocale;
    }
    console.log(`LocaleProvider - Using default locale: en`);
    return 'en';
  };
  
  const [currentLocale, setCurrentLocaleState] = useState(getInitialLocale);

  const locales = [
    { code: 'en', label: 'English' },
    { code: 'zh-Hans', label: '中文' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' }
  ];

  // Update locale based on URL path, but only if no saved locale exists
  useEffect(() => {
    const savedLocale = getLocalStorageItem('preferredLanguage');
    const path = location.pathname;
    
    // Only override with URL-based detection if no saved locale exists
    if (!savedLocale || !['en', 'zh-Hans', 'es', 'de'].includes(savedLocale)) {
      if (path.includes('/zh-Hans/')) {
        setCurrentLocaleState('zh-Hans');
      } else if (path.includes('/es/')) {
        setCurrentLocaleState('es');
      } else if (path.includes('/de/')) {
        setCurrentLocaleState('de');
      } else {
        setCurrentLocaleState('en');
      }
    }
    // If saved locale exists, keep it regardless of URL
  }, [location.pathname]);

  // Listen for language change events from the standalone switcher
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLocaleState(event.detail.locale);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const setCurrentLocale = (locale: string) => {
    console.log(`LocaleProvider - Setting locale to: ${locale}`);
    setCurrentLocaleState(locale);
    // Save to localStorage for persistence
    setLocalStorageItem('preferredLanguage', locale);
    
    // Dispatch event to notify standalone components
    const event = new CustomEvent('localeProviderChanged', { 
      detail: { locale } 
    });
    window.dispatchEvent(event);
  };

  return (
    <LocaleContext.Provider value={{ currentLocale, setCurrentLocale, locales }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  console.log(`useLocale - Current locale: ${context.currentLocale}`);
  return context;
}; 