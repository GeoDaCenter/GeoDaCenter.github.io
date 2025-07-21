import React from 'react';
import Layout from '@theme/Layout';
import Hero from '../components/Hero';
import Root from '../components/Root';
import supportContent from '../data/supportContent.json';
import siteCommon from '../data/siteCommon.json';
import { useLocalizedContent, useLocalizedContentFile } from '../utils/contentLoader';

export default function Support(): React.JSX.Element {
  return (
    <Root>
      <SupportContent />
    </Root>
  );
}

function SupportContent(): React.JSX.Element {
  const localizedSiteCommon = useLocalizedContent(siteCommon);
  const localizedSupportContent = useLocalizedContentFile('supportContent.json', supportContent);

  return (
    <Layout
      title="Support - GeoDa"
      description="Get support for GeoDa - An Introduction to Spatial Data Science"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={localizedSupportContent.tagline}
          buttons={localizedSiteCommon.hero.buttons}
        />

        <section className="main-content">
          <div style={{ maxWidth: '64rem', padding: '2rem 6rem', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
            <p>&nbsp;</p>

            {localizedSupportContent.mainContent.sections.map((section, index) => (
              <div key={index}>
                <h3>{section.title}</h3>
                
                {section.content && (
                  <p>
                    {section.content}
                    {section.links && section.links.map((link, linkIndex) => (
                      <a 
                        key={linkIndex}
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                      >
                        {link.text}
                      </a>
                    ))}
                  </p>
                )}

                {section.description && (
                  <p style={{ marginTop: '0px', marginRight: '0px', marginBottom: '0.75em', marginLeft: '0px', lineHeight: '1.5em' }}>
                    {section.description.split('Openspace mailing list').map((part, partIndex, parts) => {
                      if (partIndex === parts.length - 1) {
                        return part;
                      }
                      return (
                        <React.Fragment key={partIndex}>
                          {part}
                          <a 
                            href={section.links.find(l => l.text.includes('Openspace'))?.href || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {section.links.find(l => l.text.includes('Openspace'))?.text || 'Openspace mailing list'}
                          </a>
                        </React.Fragment>
                      );
                    })}
                  </p>
                )}

                {section.note && (
                  <p style={{ marginTop: '0px', marginRight: '0px', marginBottom: '0.75em', marginLeft: '0px', lineHeight: '1.5em' }}>
                    {section.note}
                  </p>
                )}

                {section.listItems && (
                  <ul style={{ lineHeight: '1.5em', marginTop: '0.5em', marginRight: '0px', marginBottom: '0px', marginLeft: '1.5em', listStyleType: 'square', padding: '0px' }}>
                    {section.listItems.map((item, itemIndex) => (
                      <li key={itemIndex} style={{ marginBottom: '0.5em' }}>{item}</li>
                    ))}
                    {section.links && section.links.slice(1).map((link, linkIndex) => (
                      <li key={`link-${linkIndex}`} style={{ marginBottom: linkIndex === section.links.length - 2 ? '0.5em' : '0px' }}>
                        <a 
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.text}
                        </a>
                        {linkIndex === section.links.length - 2 && ' from the Openspace mailing list (instructions)'}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <p>&nbsp;</p>
          </div>
        </section>

        
      </main>
    </Layout>
  );
} 