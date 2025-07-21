import React, { useEffect, useRef } from 'react';
import styles from './Slideshow.module.css';
import { getImagePath } from '../utils/imagePath';

// Declare the makeBSS function on window
declare global {
  interface Window {
    makeBSS: (selector: string, options: any) => void;
  }
}

interface Slide {
  image: string;
  alt: string;
  caption: string;
}

interface SlideshowProps {
  title: string;
  description: string;
  slides: Slide[];
}

export default function Slideshow({ title, description, slides }: SlideshowProps): React.JSX.Element {
  const slideshowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSlideshowScript = async () => {
      try {
        // Load the slideshow script
        const script = document.createElement('script');
        script.src = '/better-simple-slideshow.min.js';
        script.async = true;
        
        script.onload = () => {
          // Initialize slideshow after script loads
          setTimeout(() => {
            if (window.makeBSS && slideshowRef.current) {
              const opts = {
                auto: { speed: 5000, pauseOnHover: true },
                fullScreen: false,
                swipe: true
              };
              window.makeBSS('.num2', opts);
            }
          }, 100);
        };

        script.onerror = () => {
          console.error('Failed to load slideshow script');
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading slideshow script:', error);
      }
    };

    loadSlideshowScript();
  }, []);

  return (
    <div>
      <h3>
        <a id="intro-toolbar" className="anchor" href="#intro-toolbar" aria-hidden="true">
          <span className="octicon octicon-link"></span>
        </a>
        {title}
      </h3>
      <div className="bss-slides num2" tabIndex={2} ref={slideshowRef}>
        {slides.map((slide, index) => (
          <figure key={index}>
            <img 
              src={getImagePath(slide.image)} 
              className={`${styles.shadowfilter} ${styles.intro1}`} 
              width="100%" 
              alt={slide.alt}
            />
            <figcaption>{slide.caption}</figcaption>
          </figure>
        ))}
      </div>
      <p>{description}</p>
    </div>
  );
} 