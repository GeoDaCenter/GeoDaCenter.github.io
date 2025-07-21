import React, { useEffect, useRef, useState } from 'react';
import { getFilePath } from '../utils/imagePath';

declare global {
  interface Window {
    google: any;
  }
}

// Function to wait for Google Charts API to be available
const waitForGoogleCharts = (): Promise<void> => {
  return new Promise((resolve) => {
    const checkGoogle = () => {
      if (
        window.google &&
        window.google.visualization &&
        window.google.visualization.AreaChart
      ) {
        resolve();
      } else {
        setTimeout(checkGoogle, 100);
      }
    };
    checkGoogle();
  });
};

// Function to dynamically load Google Charts API
const loadGoogleCharts = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.google && window.google.visualization) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.google.com/jsapi';
    script.onload = () => {
      window.google.load('visualization', '1', {
        packages: ['areachart'],
        callback: () => {
          // Wait a bit more for the API to be fully initialized
          setTimeout(resolve, 100);
        },
      });
    };
    script.onerror = () => {
      console.error('Failed to load Google Charts API');
      resolve(); // Resolve anyway to prevent hanging
    };
    document.head.appendChild(script);
  });
};

export default function DownloadChart(): React.JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<any[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(getFilePath('data/download_data.json'));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setChartData(data);
        } else {
          console.error('DownloadChart: Data is not a valid array or is empty');
          setError('Invalid data format');
          setChartData([]);
        }
      } catch (error) {
        console.error('DownloadChart: Error fetching data:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to fetch data'
        );
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const initializeChart = async () => {
      try {
        if (!chartRef.current) {
          console.error('DownloadChart: Chart ref not available');
          return;
        }

        if (!chartData || chartData.length < 2) {
          console.log(
            'DownloadChart: No chart data available - chartData:',
            chartData
          );
          console.log(
            'DownloadChart: chartData length:',
            chartData ? chartData.length : 'undefined'
          );
          return;
        }

        // Load Google Charts API if not already loaded
        await loadGoogleCharts();

        // Wait for Google Charts to be fully available
        await waitForGoogleCharts();

        if (
          !window.google ||
          !window.google.visualization ||
          !window.google.visualization.AreaChart
        ) {
          console.error('DownloadChart: Google Charts API not available');
          return;
        }

        // Use the 2D array directly
        const dataTable =
          window.google.visualization.arrayToDataTable(chartData);

        // Get the latest stats from the DataTable
        const numRows = dataTable.getNumberOfRows();
        const latestDownloads = dataTable.getValue(numRows - 1, 1);
        const latestDate = dataTable.getValue(numRows - 1, 0);

        const downloadsStr =
          latestDownloads != null && latestDownloads.toLocaleString
            ? latestDownloads.toLocaleString()
            : latestDownloads != null
            ? String(latestDownloads)
            : '0';

        const options = {
          height: 300,
          title: `More than ${downloadsStr} GeoDa Software users (${
            latestDate ?? ''
          })`,
          colors: ['#AAAAFC'],
          legend: 'none',
          backgroundColor: {
            stroke: 'none',
            fill: '#eee',
            strokeSize: 1,
          },
          chartArea: {
            width: '90%',
            height: '70%',
          },
          hAxis: {
            title: 'Date',
            textStyle: {
              fontSize: 10,
            },
          },
          vAxis: {
            title: 'Downloads',
            textStyle: {
              fontSize: 10,
            },
          },
        };

        const chart = new window.google.visualization.AreaChart(
          chartRef.current
        );
        chart.draw(dataTable, options);

      } catch (error) {
        console.error('DownloadChart: Error initializing chart:', error);
      }
    };

    initializeChart();
  }, [chartData]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: '400px',
          marginBottom: '1rem',
        }}
      >
        {isLoading && (
          <div style={{ textAlign: 'center' }}>
            <p>Loading download statistics...</p>
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', color: 'red' }}>
            <p>Error: {error}</p>
          </div>
        )}
        {!isLoading && !error && (!chartData || chartData.length < 2) && (
          <div style={{ textAlign: 'center' }}>
            <p>No chart data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
