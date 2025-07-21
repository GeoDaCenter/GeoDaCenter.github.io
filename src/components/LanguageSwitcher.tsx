import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from '../utils/localeContext';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { currentLocale, setCurrentLocale, locales } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const switchLanguage = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    setCurrentLocale(newLocale);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div 
      ref={dropdownRef}
      className={`language-switcher ${className || ''}`}
      style={{
        position: 'relative',
        display: 'inline-block'
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
        style={{
          background: 'none',
          border: 'none',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.7)',
          textDecoration: 'none',
          fontWeight: '500',
          transition: 'color 0.2s ease',
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
        }}
      >
        <span style={{ fontSize: '18px', lineHeight: 1 }}>🌐</span>
        Language
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: '4px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 1000,
            minWidth: '120px',
            overflow: 'hidden'
          }}
        >
          <ul
            role="listbox"
            style={{
              listStyle: 'none',
              margin: '0',
              padding: '4px 0'
            }}
          >
            {locales.map((locale) => (
              <li key={locale.code} role="option" aria-selected={locale.code === currentLocale}>
                <button
                  type="button"
                  onClick={() => switchLanguage(locale.code)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: locale.code === currentLocale ? '#f3f4f6' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left',
                    color: locale.code === currentLocale ? '#1f2937' : '#374151',
                    fontWeight: locale.code === currentLocale ? '600' : '400',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    if (locale.code !== currentLocale) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (locale.code !== currentLocale) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {locale.code === currentLocale && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  <span>{locale.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 