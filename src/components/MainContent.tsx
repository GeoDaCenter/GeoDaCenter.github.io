import React, { useState, useEffect } from 'react';
import styles from './MainContent.module.css';
import commonStyles from '../styles/common.module.css';
import { processContentWithLinks } from '../utils/contentProcessor';

// Declare the makeBSS function on window
declare global {
  interface Window {
    makeBSS: (selector: string, options: any) => void;
  }
}

interface Link {
  text: string;
  href: string;
  external?: boolean;
}

interface IntroSection {
  title: string;
  content: string[];
  links: Link[];
  youtubeVideo: {
    src: string;
    width: string;
    height: string;
  };
}

interface SlideshowSection {
  title: string;
  description: string;
  slides: Array<{
    image: string;
    alt: string;
    caption: string;
  }>;
}

interface ContentSection {
  id: string;
  title: string;
  content: string;
  image: string;
  imageAlt: string;
  imageWidth?: string;
  links?: Link[];
}

interface MainContentProps {
  intro: IntroSection;
  slideshow: SlideshowSection;
  sections: ContentSection[];
}

export default function MainContent({
  intro,
  slideshow,
  sections,
}: MainContentProps): React.JSX.Element {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set());

  // Smooth scroll function
  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Intersection Observer for lazy loading images
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageSrc = entry.target.getAttribute('data-src');
            if (imageSrc) {
              setVisibleImages((prev) => new Set(prev).add(imageSrc));
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1,
      }
    );

    // Observe all images with data-src attribute
    const images = document.querySelectorAll('[data-src]');
    images.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshow.slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slideshow.slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slideshow.slides.length) % slideshow.slides.length
    );
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slideshow.slides.length);
  };

  return (
    <section className={styles.mainContent}>
      <h3 className={commonStyles.heading}>
        <a
          id="welcome-to-github-pages"
          className="anchor"
          href="#welcome-to-github-pages"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('welcome-to-github-pages');
          }}
          aria-hidden="true"
        >
          <span className="octicon octicon-link"></span>
        </a>
        {intro.title}
      </h3>

      <p>{processContentWithLinks(intro.content[0], intro.links)}</p>

      <div
        style={{
          float: 'right',
          clear: 'right',
          marginLeft: '1rem',
          marginBottom: '1rem',
        }}
      >
        <iframe
          width={intro.youtubeVideo.width}
          height={intro.youtubeVideo.height}
          src={intro.youtubeVideo.src}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {intro.content.slice(1).map((paragraph, index) => (
        <p key={index}>{processContentWithLinks(paragraph, intro.links)}</p>
      ))}

      <h3 className={commonStyles.heading}>
        <a
          id="intro-toolbar"
          className="anchor"
          href="#intro-toolbar"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('intro-toolbar');
          }}
          aria-hidden="true"
        >
          <span className="octicon octicon-link"></span>
        </a>
        {slideshow.title}
      </h3>
      <p>{slideshow.description}</p>

      <div className={styles.modernSlideshow}>
        <div className={styles.slideshowContainer}>
          {slideshow.slides.map((slide, index) => (
            <div
              key={index}
              className={`${styles.slide} ${
                index === currentSlide ? styles.active : ''
              }`}
            >
              <img
                src={visibleImages.has(slide.image) ? slide.image : ''}
                data-src={slide.image}
                className={`${styles.slideImage} ${styles.shadowfilter}`}
                alt={slide.alt}
                style={{
                  opacity: visibleImages.has(slide.image) ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              />
              <div className={styles.caption}>{slide.caption}</div>
            </div>
          ))}
        </div>

        <div className={styles.slideshowControls}>
          <button
            className={styles.navButton}
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            ‹
          </button>

          <div className={styles.dots}>
            {slideshow.slides.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${
                  index === currentSlide ? styles.activeDot : ''
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            className={styles.navButton}
            onClick={goToNext}
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        <button
          className={styles.playPauseButton}
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isAutoPlaying ? '⏸' : '▶'}
        </button>
      </div>

      {sections.map((section, index) => (
        <div key={section.id}>
          <br />
          <h3 className={commonStyles.heading}>
            <a
              id={section.id}
              className="anchor"
              href={`#${section.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(section.id);
              }}
              aria-hidden="true"
            >
              <span className="octicon octicon-link"></span>
            </a>
            {section.title}
          </h3>
          <p>
            {section.links
              ? processContentWithLinks(section.content, section.links)
              : section.content}
          </p>
          <p>
            <img
              src={visibleImages.has(section.image) ? section.image : ''}
              data-src={section.image}
              className={styles.shadowfilter}
              alt={section.imageAlt}
              {...(section.imageWidth && { width: section.imageWidth })}
              style={{
                opacity: visibleImages.has(section.image) ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
            />
          </p>
        </div>
      ))}
    </section>
  );
}
