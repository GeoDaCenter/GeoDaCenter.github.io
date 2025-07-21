import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Root from '../components/Root';
import commonStyles from '../styles/common.module.css';
import Hero from '../components/Hero';
import DonationSection from '../components/DonationSection';
import DownloadButtons from '../components/DownloadButtons';
import ReleaseList from '../components/ReleaseList';
import LabInstallation from '../components/LabInstallation';
import MapSection from '../components/MapSection';
import DownloadChart from '../components/DownloadChart';
import downloadContent from '../data/downloadContent.json';
import siteCommon from '../data/siteCommon.json';
import { useLocalizedContent, useLocalizedContentFile } from '../utils/contentLoader';
import { getFilePath } from '../utils/imagePath';

interface CountryDownload {
  id: string;
  count: string;
}

export default function Download(): React.JSX.Element {
  return (
    <Root>
      <DownloadContent />
    </Root>
  );
}

function DownloadContent(): React.JSX.Element {
  const [countryDownloads, setCountryDownloads] = useState<CountryDownload[]>(
    []
  );

  const localizedSiteCommon = useLocalizedContent(siteCommon);
  const localizedDownloadContent = useLocalizedContentFile('downloadContent.json', downloadContent);
  
  useEffect(() => {
    // Load country download data
    fetch(getFilePath('data/down_by_country.csv'))
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then((csv) => {
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map((line) => {
          const values = line.split(',');
          return {
            id: values[0] || '',
            count: values[1] || '0',
          };
        });
        setCountryDownloads(data);
      })
      .catch((err) => {
        console.error('Error loading country data:', err);
        // Set empty array as fallback
        setCountryDownloads([]);
      });
  }, []);

  return (
    <Layout
      title="Download GeoDa"
      description="Download GeoDa - An Introduction to Spatial Data Science"
    >
      <main>
        <Hero
          title={localizedSiteCommon.hero.title}
          tagline={localizedDownloadContent.title}
          buttons={localizedSiteCommon.hero.buttons}
        />

        <div className={commonStyles.container}>
          <div className={commonStyles.content}>
            <DonationSection
              title={localizedDownloadContent.donation.title}
              content={localizedDownloadContent.donation.content}
              links={localizedDownloadContent.donation.links}
              image={localizedDownloadContent.donation.image}
              imageAlt={localizedDownloadContent.donation.imageAlt}
              description={localizedDownloadContent.donation.description}
              descriptionLinks={localizedDownloadContent.donation.descriptionLinks}
            />

            <DownloadButtons
              buttons={localizedDownloadContent.downloadButtons.buttons}
            />

            <LabInstallation
              title={localizedDownloadContent.labInstallation.title}
              description={localizedDownloadContent.labInstallation.description}
              text={localizedDownloadContent.labInstallation.text}
              href={localizedDownloadContent.labInstallation.href}
            />

            <ReleaseList
              title={localizedDownloadContent.releaseList.title}
              releaseNotesLink={localizedDownloadContent.releaseList.releaseNotesLink}
              releases={localizedDownloadContent.releaseList.releases}
            />

            <MapSection
              title={localizedDownloadContent.map.title}
              countryDownloads={countryDownloads}
            />

            <DownloadChart />
          </div>
        </div>
      </main>
    </Layout>
  );
}
