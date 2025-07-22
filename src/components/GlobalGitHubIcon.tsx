import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import GitHubIcon from './GitHubIcon';

const GlobalGitHubIcon: React.FC = () => {
  useEffect(() => {
    const injectGitHubIcon = () => {
      // Find the navbar items container
      const navbarItems = document.querySelector('.navbar__items--right');
      
      if (navbarItems && !document.querySelector('.global-github-icon')) {
        console.log('Injecting GitHub icon into navbar');
        
        // Find the existing GitHub text link and remove it
        const existingGitHubLink = Array.from(navbarItems.children).find(
          (child) => child.textContent?.trim() === 'GitHub'
        );
        
        if (existingGitHubLink) {
          existingGitHubLink.remove();
        }
        
        // Create container for the GitHub icon
        const githubContainer = document.createElement('div');
        githubContainer.className = 'navbar__item global-github-icon';
        githubContainer.style.display = 'inline-block';
        githubContainer.style.marginLeft = '8px';
        
        // Insert the GitHub icon
        navbarItems.appendChild(githubContainer);
        
        // Render the GitHubIcon component
        const root = createRoot(githubContainer);
        root.render(<GitHubIcon />);
      }
    };

    // Try to inject immediately
    injectGitHubIcon();
    
    // If navbar isn't ready yet, try again after a delay
    if (!document.querySelector('.navbar__items--right')) {
      setTimeout(injectGitHubIcon, 500);
    }
    
    // Also try on route changes
    const observer = new MutationObserver(() => {
      if (!document.querySelector('.global-github-icon')) {
        injectGitHubIcon();
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

export default GlobalGitHubIcon; 