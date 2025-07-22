import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import StandaloneLanguageSwitcher from './StandaloneLanguageSwitcher';

const GlobalLanguageSwitcher: React.FC = () => {
  useEffect(() => {
    const injectLanguageSwitcher = () => {
      // Find the navbar items container
      const navbarItems = document.querySelector('.navbar__items--right');
      
      if (navbarItems && !document.querySelector('.global-language-switcher')) {
        console.log('Injecting language switcher into navbar');
        
        // Create container for the language switcher
        const languageContainer = document.createElement('div');
        languageContainer.className = 'navbar__item global-language-switcher';
        languageContainer.style.display = 'inline-block';
        languageContainer.style.marginLeft = '8px';
        languageContainer.style.flexShrink = '0';
        
        // Insert after the last navbar item
        navbarItems.appendChild(languageContainer);
        
        // Render the StandaloneLanguageSwitcher component
        const root = createRoot(languageContainer);
        root.render(<StandaloneLanguageSwitcher />);
      }
    };

    // Try to inject immediately
    injectLanguageSwitcher();
    
    // If navbar isn't ready yet, try again after a delay
    if (!document.querySelector('.navbar__items--right')) {
      setTimeout(injectLanguageSwitcher, 500);
    }
    
    // Also try on route changes
    const observer = new MutationObserver(() => {
      if (!document.querySelector('.global-language-switcher')) {
        injectLanguageSwitcher();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default GlobalLanguageSwitcher; 