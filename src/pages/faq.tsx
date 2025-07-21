import React from 'react';
import Layout from '@theme/Layout';
import Hero from '../components/Hero';
import Root from '../components/Root';
import siteCommon from '../data/siteCommon.json';
import faqContent from '../data/faqContent.json';
import { useLocalizedContent, useLocalizedContentFile } from '../utils/contentLoader';
import { processContentWithLinks } from '../utils/contentProcessor';

export default function FAQ(): React.JSX.Element {
  return (
    <Root>
      <FAQContent />
    </Root>
  );
}

function FAQContent(): React.JSX.Element {
  const localizedSiteCommon = useLocalizedContent(siteCommon);
  const localizedFaqContent = useLocalizedContentFile('faqContent.json', faqContent);

  return (
    <Layout
      title="FAQs - GeoDa"
      description="Frequently Asked Questions about GeoDa - An Introduction to Spatial Data Science"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={localizedFaqContent.title}
          buttons={localizedSiteCommon.hero.buttons}
        />

        <section className="main-content">
          <div style={{ maxWidth: '64rem', padding: '2rem 6rem', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
            <ul>
              {localizedFaqContent.navigation.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ul>

            {localizedFaqContent.questions.map((q) => (
              <div key={q.id}>
                <h2 id={q.id}>{q.question}</h2>
                <p>{processContentWithLinks(q.answer, q.links || [])}</p>
              </div>
            ))}

            <h3>
              <a id="intro-contact" className="anchor" href="#intro-contact" aria-hidden="true">
                <span className="octicon octicon-link"></span>
              </a>
              {localizedFaqContent.contact.title}
            </h3>
            <p>{processContentWithLinks(localizedFaqContent.contact.content, localizedFaqContent.contact.links)}</p>
          </div>
        </section>

        
      </main>
    </Layout>
  );
} 