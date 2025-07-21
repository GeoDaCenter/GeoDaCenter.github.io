import React from 'react';
import Layout from '@theme/Layout';
import Hero from '../components/Hero';
import Root from '../components/Root';
import siteCommon from '../data/siteCommon.json';
import questionsContent from '../data/questionsContent.json';
import { useLocalizedContent, useLocalizedContentFile } from '../utils/contentLoader';
import { processContentWithLinks, processQuestionContent } from '../utils/contentProcessor';

export default function Questions(): React.JSX.Element {
  return (
    <Root>
      <QuestionsContent />
    </Root>
  );
}

function QuestionsContent(): React.JSX.Element {
  const localizedSiteCommon = useLocalizedContent(siteCommon);
  const localizedQuestionsContent = useLocalizedContentFile('questionsContent.json', questionsContent);

  return (
    <Layout
      title="Technical Questions - GeoDa"
      description="Answers to Technical GeoDa Questions - An Introduction to Spatial Data Science"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={localizedQuestionsContent.title}
          buttons={localizedSiteCommon.hero.buttons}
        />

        <section className="main-content">
          <div style={{ maxWidth: '64rem', padding: '2rem 6rem', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
            <ul>
              {localizedQuestionsContent.navigation.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ul>

            {localizedQuestionsContent.questions.map((q) => (
              <div key={q.id}>
                <h2 id={q.id}>{q.question}</h2>
                {processQuestionContent(q)}
              </div>
            ))}

            <h3>
              <a id="intro-contact" className="anchor" href="#intro-contact" aria-hidden="true">
                <span className="octicon octicon-link"></span>
              </a>
              {localizedQuestionsContent.contact.title}
            </h3>
            <p>{processContentWithLinks(localizedQuestionsContent.contact.content, localizedQuestionsContent.contact.links)}</p>
          </div>
        </section>

        
      </main>
    </Layout>
  );
} 