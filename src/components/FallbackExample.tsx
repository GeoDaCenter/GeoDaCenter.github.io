import React from 'react';
import { useLocalizedContent, useLocalizedContentFile, useLocalizedProperty } from '../utils/contentLoader';
import indexContent from '../data/indexContent.json';
import siteCommon from '../data/siteCommon.json';

export default function FallbackExample(): React.JSX.Element {
  // Example 1: Using the enhanced useLocalizedContentFile with deep merge
  const localizedIndexContent = useLocalizedContentFile('indexContent.json', indexContent);
  
  // Example 2: Using the new useLocalizedProperty for specific properties
  const introTitle = useLocalizedProperty<string>(
    'mainContent.intro.title',
    indexContent,
    'indexContent.json'
  );
  
  // Example 3: Getting a property that exists in English but not in Chinese
  const sectionsCount = useLocalizedProperty<number>(
    'mainContent.sections.length',
    indexContent,
    'indexContent.json'
  );
  
  // Example 4: Getting a specific section that might not exist in Chinese
  const firstSectionTitle = useLocalizedProperty<string>(
    'mainContent.sections.0.title',
    indexContent,
    'indexContent.json'
  );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Fallback System Demonstration</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Example 1: Deep Merge Fallback</h3>
        <p><strong>Intro Title:</strong> {localizedIndexContent.mainContent.intro.title}</p>
        <p><strong>Number of Sections:</strong> {localizedIndexContent.mainContent.sections.length}</p>
        <p><strong>First Section Title:</strong> {localizedIndexContent.mainContent.sections[0]?.title || 'Not available'}</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f4fd', borderRadius: '8px' }}>
        <h3>Example 2: Property-Level Fallback</h3>
        <p><strong>Intro Title (direct):</strong> {introTitle}</p>
        <p><strong>Sections Count:</strong> {sectionsCount}</p>
        <p><strong>First Section Title (direct):</strong> {firstSectionTitle || 'Not available'}</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>How It Works</h3>
        <ul>
          <li><strong>Deep Merge:</strong> The enhanced <code>useLocalizedContentFile</code> now merges localized content with English fallback, ensuring all properties exist.</li>
          <li><strong>Property-Level Access:</strong> The new <code>useLocalizedProperty</code> function allows accessing specific nested properties with automatic fallback.</li>
          <li><strong>Graceful Degradation:</strong> If a property is missing in Chinese/Spanish, it automatically uses the English version.</li>
          <li><strong>Console Warnings:</strong> The system logs when fallbacks are used, helping developers identify missing translations.</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '8px' }}>
        <h3>Usage Examples</h3>
        <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
{`// For entire content objects with fallback
const content = useLocalizedContentFile('indexContent.json', defaultContent);

// For specific properties with fallback
const title = useLocalizedProperty('mainContent.intro.title', defaultContent, 'indexContent.json');

// For nested properties
const sectionTitle = useLocalizedProperty('mainContent.sections.0.title', defaultContent, 'indexContent.json');`}
        </pre>
      </div>
    </div>
  );
} 