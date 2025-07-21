import React from 'react';
import styles from './MainContent.module.css';
import commonStyles from '../styles/common.module.css';
import { processContentWithLinks } from '../utils/contentProcessor';

interface Link {
  text: string;
  href: string;
  external?: boolean;
}

interface NotesSection {
  title: string;
  content: string;
  items: string[];
}

interface WindowsSection {
  title: string;
  content: string;
  command: string;
  additionalInfo: string;
  prerequisites: {
    content: string;
    command: string;
    note: string;
  };
  links: Link[];
}

interface CentOSSection {
  title: string;
  content: string;
  links: Link[];
}

interface LabInstallContentProps {
  notes: NotesSection;
  windows: WindowsSection;
  centos: CentOSSection;
}

export default function LabInstallContent({
  notes,
  windows,
  centos,
}: LabInstallContentProps): React.JSX.Element {
  return (
    <section className={styles.mainContent}>
      <h3 className={commonStyles.heading}>
        <a
          id="lab-installation"
          className="anchor"
          href="#lab-installation"
          aria-hidden="true"
        >
          <span className="octicon octicon-link"></span>
        </a>
        Lab Installation
      </h3>

      <h4 className={commonStyles.subheading}>
        <a
          id="intro-contact"
          className="anchor"
          href="#intro-contact"
          aria-hidden="true"
        >
          <span className="octicon octicon-link"></span>
        </a>
        {notes.title}
      </h4>

      <p>{notes.content}</p>
      <ul style={{ marginLeft: '20px' }}>
        {notes.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h4 className={commonStyles.subheading}>{windows.title}</h4>
      <p>{windows.content}</p>
      <div style={{ padding: '5px', backgroundColor: 'black', color: 'rgb(0, 204, 0)' }}>
        &nbsp;&nbsp;{windows.command}
      </div>
      <p>{processContentWithLinks(windows.additionalInfo, windows.links)}</p>
      <p>{windows.prerequisites.content}</p>
      <div style={{ padding: '5px', backgroundColor: 'black', color: 'rgb(0, 204, 0)' }}>
        &nbsp;&nbsp;{windows.prerequisites.command}
      </div>
      <p>{windows.prerequisites.note}</p>

      <h4 className={commonStyles.subheading}>{centos.title}</h4>
      <p>
        {centos.content} {processContentWithLinks(centos.links[0].text, centos.links)}
      </p>
    </section>
  );
} 