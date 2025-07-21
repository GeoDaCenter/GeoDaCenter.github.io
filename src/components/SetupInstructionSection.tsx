import React from 'react';
import styles from './SetupInstructionSection.module.css';
import { getImagePath } from '../utils/imagePath';

interface SetupInstructionSectionProps {
  id: string;
  title: string;
  steps: string[];
  image?: string;
  imageAlt?: string;
  commandBlock?: boolean;
}

export default function SetupInstructionSection({ 
  id, 
  title, 
  steps, 
  image, 
  imageAlt, 
  commandBlock 
}: SetupInstructionSectionProps): React.JSX.Element {
  return (
    <div id={id} className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <ol className={styles.stepsList}>
        {steps.map((step, index) => (
          <li key={index} className={styles.step}>
            {commandBlock && (step.startsWith('cd ') || step.startsWith('export ') || step.startsWith('./') || step.startsWith('echo ')) ? (
              <code className={styles.commandCode}>{step}</code>
            ) : (
              <span dangerouslySetInnerHTML={{ __html: step }} />
            )}
          </li>
        ))}
      </ol>
      {image && (
        <div className={styles.imageContainer}>
          <img src={getImagePath(image)} alt={imageAlt || title} className={styles.instructionImage} />
        </div>
      )}
    </div>
  );
} 