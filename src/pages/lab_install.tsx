import React from 'react';
import Layout from '@theme/Layout';
import commonStyles from '../styles/common.module.css';
import Hero from '../components/Hero';
import LabInstallContent from '../components/LabInstallContent';
import Root from '../components/Root';
import labInstallContent from '../data/labInstallContent.json';
import siteCommon from '../data/siteCommon.json';
import { useLocalizedContent, useLocalizedContentFile } from '../utils/contentLoader';

export default function LabInstall(): React.JSX.Element {
  return (
    <Root>
      <LabInstallContentWrapper />
    </Root>
  );
}

function LabInstallContentWrapper(): React.JSX.Element {
  const localizedSiteCommon = useLocalizedContent(siteCommon);
  const localizedLabInstallContent = useLocalizedContentFile('labInstallContent.json', labInstallContent);

  return (
    <Layout
      title="Lab Installation Guide - GeoDa"
      description="Lab Installation Guide for GeoDa - Instructions for installing GeoDa in lab environments"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={localizedLabInstallContent.title}
          buttons={localizedSiteCommon.hero.buttons}
        />

        <div className={commonStyles.container}>
          <div className={commonStyles.content}>
            <LabInstallContent
              notes={localizedLabInstallContent.notes}
              windows={localizedLabInstallContent.windows}
              centos={localizedLabInstallContent.centos}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
} 