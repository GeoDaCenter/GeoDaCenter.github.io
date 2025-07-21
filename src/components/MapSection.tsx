import React, { useState } from 'react';
import styles from './MainContent.module.css';
import commonStyles from '../styles/common.module.css';
import GeoDaMap from './GeoDaMap';

interface CountryDownload {
  id: string;
  count: string;
}

interface MapSectionProps {
  title: string;
  countryDownloads: CountryDownload[];
}

export default function MapSection({ title, countryDownloads }: MapSectionProps): React.JSX.Element {
  const [mapView, setMapView] = useState<'3d' | '2d'>('3d');

  return (
    <section className={styles.mainContent}>
      <h3 className={commonStyles.heading}>{title}</h3>
      <div className={styles.mapControls}>
        <button
          className={`btn lab-btn`}
          onClick={() => setMapView(mapView === '3d' ? '2d' : '3d')}
        >
          {mapView === '3d' ? '2D' : '3D'}
        </button>
      </div>
      <div className={styles.mapContainer}>
        <GeoDaMap mapView={mapView} countryDownloads={countryDownloads} />
      </div>
    </section>
  );
} 