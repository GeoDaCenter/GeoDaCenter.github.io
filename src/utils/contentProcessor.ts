import React from 'react';

interface Link {
  text: string;
  href: string;
  external?: boolean;
}

interface ProcessedContent {
  content: string;
  links: Link[];
}

interface AdditionalParagraph {
  content: string;
  links?: Link[];
}

interface Question {
  id: string;
  question: string;
  answer: string;
  links?: Link[];
  list?: string[];
  additionalParagraphs?: AdditionalParagraph[];
}

export function processContentWithLinks(content: string, links: Link[]): React.ReactNode[] {
  if (!links || links.length === 0) {
    return [content];
  }

  const parts: React.ReactNode[] = [];
  let currentContent = content;

  links.forEach((link, index) => {
    const linkIndex = currentContent.indexOf(link.text);
    if (linkIndex !== -1) {
      // Add text before the link
      if (linkIndex > 0) {
        parts.push(currentContent.substring(0, linkIndex));
      }

      // Add the link
      if (link.external) {
        parts.push(
          React.createElement('a', {
            key: index,
            href: link.href,
            target: '_blank',
            rel: 'noopener noreferrer'
          }, link.text)
        );
      } else {
        parts.push(
          React.createElement('a', {
            key: index,
            href: link.href
          }, link.text)
        );
      }

      // Update remaining content
      currentContent = currentContent.substring(linkIndex + link.text.length);
    }
  });

  // Add any remaining content
  if (currentContent) {
    parts.push(currentContent);
  }

  return parts.length > 0 ? parts : [content];
}

export function processParagraphsWithLinks(paragraphs: string[], links: Link[]): React.ReactNode[] {
  return paragraphs.map((paragraph, index) => 
    React.createElement('p', { key: index }, processContentWithLinks(paragraph, links))
  );
}

export function processQuestionContent(question: Question): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  
  // Process main answer
  elements.push(
    React.createElement('p', { key: 'answer' }, 
      processContentWithLinks(question.answer, question.links || [])
    )
  );
  
  // Process list if present
  if (question.list && question.list.length > 0) {
    elements.push(
      React.createElement('ul', { key: 'list' },
        question.list.map((item, index) => 
          React.createElement('li', { key: index }, item)
        )
      )
    );
  }
  
  // Process additional paragraphs if present
  if (question.additionalParagraphs && question.additionalParagraphs.length > 0) {
    question.additionalParagraphs.forEach((paragraph, index) => {
      elements.push(
        React.createElement('p', { key: `additional-${index}` },
          processContentWithLinks(paragraph.content, paragraph.links || [])
        )
      );
    });
  }
  
  return elements;
} 