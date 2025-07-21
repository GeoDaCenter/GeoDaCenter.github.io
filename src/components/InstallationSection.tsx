import React from 'react';
import styles from './MainContent.module.css';
import commonStyles from '../styles/common.module.css';
import { getImagePath } from '../utils/imagePath';

interface InstallationStep {
  step: string;
  image: string;
}

interface InstallationSectionProps {
  id?: string;
  title: string;
  steps?: InstallationStep[] | string[];
  images?: string[];
  content?: string;
  alternative?: {
    content: string;
    image: string;
  };
}

export default function InstallationSection({ 
  id,
  title, 
  steps, 
  images, 
  content,
  alternative 
}: InstallationSectionProps): React.JSX.Element {
  return (
    <div id={id} className={styles.installationSection}>
      <h4 className={commonStyles.heading}>{title}</h4>
      
      {content && (
        <p>{content}</p>
      )}
      
      {steps && (
        <div className={styles.installationSteps}>
          {steps.map((step, index) => {
            if (typeof step === 'string') {
              return (
                <div key={index} className={styles.installationStep}>
                  <p>{step}</p>
                </div>
              );
            }
            return (
              <div key={index} className={styles.installationStep}>
                <p>{step.step}</p>
                <img 
                  src={getImagePath(step.image)} 
                  alt={`Installation step ${index + 1}`}
                  className={styles.installationImage}
                />
              </div>
            );
          })}
        </div>
      )}
      
      {images && (
        <div className={(() => {
          // Check if any of the images should not be scaled
          const hasNoScaleImages = images.some(image => 
            image.includes('win_setup_result_2.png') || image.includes('win_setup_result_3.png')
          );
          return hasNoScaleImages ? styles.installationImagesNoFlex : styles.installationImages;
        })()}>
          {images.map((image, index) => {
            // Check if this is one of the specific images that should not be scaled
            const shouldNotScale = image.includes('win_setup_result_2.png') || image.includes('win_setup_result_3.png');
            return (
              <img 
                key={index}
                src={getImagePath(image)} 
                alt={`Installation result ${index + 1}`}
                className={shouldNotScale ? styles.installationImageNoScale : styles.installationImage}
              />
            );
          })}
        </div>
      )}
      
      {alternative && (
        <div className={styles.alternativeMethod}>
          <p>{alternative.content}</p>
          <img 
            src={getImagePath(alternative.image)} 
            alt="Alternative installation method"
            className={styles.installationImage}
          />
        </div>
      )}
    </div>
  );
} 