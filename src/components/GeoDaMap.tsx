import React, { useEffect, useRef } from 'react';
import styles from '../pages/download.module.css';
import { getFilePath } from '../utils/imagePath';

interface GeoDaMapProps {
  mapView: '3d' | '2d';
  countryDownloads: Array<{ id: string; count: string }>;
}

declare global {
  interface Window {
    d3: any;
    topojson: any;
    queue: any;
    ss: any;
  }
}

// Use global objects from CDN
const d3 = (typeof window !== 'undefined' && window.d3) ? window.d3 : null;
const topojson = (typeof window !== 'undefined' && window.topojson) ? window.topojson : null;
const queue = (typeof window !== 'undefined' && window.queue) ? window.queue : null;

// Function to wait for global objects to be available
const waitForGlobals = (): Promise<void> => {
  return new Promise((resolve) => {
    const checkGlobals = () => {
      if (window.d3 && window.topojson && window.queue && window.ss) {
        resolve();
      } else {
        setTimeout(checkGlobals, 100);
      }
    };
    checkGlobals();
  });
};

// Function to dynamically load scripts
const loadScripts = (): Promise<void> => {
  return new Promise((resolve) => {
    const scripts = [
      '//d3js.org/d3.v3.min.js',
      '//d3js.org/topojson.v1.min.js',
      '//d3js.org/queue.v1.min.js',
      '/simple_statistics.js'
    ];
    
    let loadedCount = 0;
    
    scripts.forEach((src) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        loadedCount++;
        if (loadedCount === scripts.length) {
          // Wait a bit more for scripts to initialize
          setTimeout(resolve, 100);
        }
      };
      script.onerror = () => {
        console.error(`Failed to load script: ${src}`);
        loadedCount++;
        if (loadedCount === scripts.length) {
          setTimeout(resolve, 100);
        }
      };
      document.head.appendChild(script);
    });
  });
};

// Function to get theme-aware text color
const getThemeTextColor = (): string => {
  if (typeof window !== 'undefined') {
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDarkTheme ? '#ffffff' : '#333333';
  }
  return '#333333'; // Default fallback
};

export default function GeoDaMap({ mapView, countryDownloads }: GeoDaMapProps): React.JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null);
  const map2dRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Check if scripts are already loaded, if not load them
        if (!window.d3 || !window.topojson || !window.queue || !window.ss) {
          console.log('GeoDaMap: Scripts not found, loading dynamically...');
          await loadScripts();
        }
        
        // Wait for global objects to be available
        await waitForGlobals();
        
        if (!mapRef.current || !map2dRef.current) {
          console.error('Map refs not available');
          return;
        }

        // Check if required libraries are available
        if (!window.d3 || !window.d3.geo || !window.d3.geo.equirectangular) {
          console.error('D3 v3 geo API not available');
          return;
        }

        if (!window.topojson) {
          console.error('TopoJSON not available');
          return;
        }

        if (!window.queue) {
          console.error('Queue library not available');
          return;
        }

        if (!window.ss) {
          console.error('Simple Statistics not available');
          return;
        }

        // Clear existing content
        mapRef.current.innerHTML = '';
        map2dRef.current.innerHTML = '';

        // Create tooltip exactly like original
        const countryTooltip = window.d3.select("body").append("div").attr("class", "countryTooltip");

        // 2D map setup - exactly like original
        const projection2d = window.d3.geo.equirectangular().scale(150);
        const path2d = window.d3.geo.path().projection(projection2d);
        const svg2d = window.d3.select(map2dRef.current)
          .append('svg')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('viewBox', '0 0 900 500')
          .attr('preserveAspectRatio', 'xMidYMid meet');
        
        svg2d.append('path')
          .datum({ type: 'Sphere' })
          .attr('class', styles.water)
          .attr('d', path2d);

        // 3D map setup - exactly like original
        const width = 600;
        const height = 500;
        const sens = 0.25;
        let focused: any;
        let interrupt = false;
        const scales: any = {};

        const projection = window.d3.geo.orthographic()
          .scale(245)
          .rotate([0, 0])
          .translate([width / 2, height / 2])
          .clipAngle(90);

        const path = window.d3.geo.path().projection(projection);

        const svg = window.d3.select(mapRef.current)
          .append('svg')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('viewBox', `-100 0 ${width + 100} ${height}`)
          .attr('preserveAspectRatio', 'xMidYMid meet');

        // Add water for 3D map - exactly like original
        svg.append('path')
          .datum({ type: 'Sphere' })
          .attr('class', styles.water)
          .attr('d', path)
          .call(window.d3.behavior.drag()
            .origin(() => {
              interrupt = true;
              const r = projection.rotate();
              return { x: r[0] / sens, y: -r[1] / sens };
            })
            .on('drag', () => {
              const rotate = projection.rotate();
              projection.rotate([window.d3.event.x * sens, -window.d3.event.y * sens, rotate[2]]);
              svg.selectAll(`path.${styles.land}`).attr('d', path);
              svg.selectAll('.focused').classed('focused', focused = false);
            })
          );

        // Load data exactly like original
        window.queue()
          .defer(window.d3.json, getFilePath('data/world-110m.json'))
          .defer(window.d3.tsv, getFilePath('data/world-110m-country-names.tsv'))
          .defer(window.d3.csv, getFilePath('data/down_by_country.csv'))
          .await(ready);

        // Main function - exactly like original
        function ready(error: any, world: any, countryData: any, countryDownloads: any) {
          if (error) {
            console.error('GeoDaMap: Error loading data:', error);
            return;
          }

          if (!world || !world.objects) {
            console.error('GeoDaMap: World data is missing or invalid');
            return;
          }

          const origin = [71, -42];
          const velocity = [0.010, -0.002];
          const t0 = Date.now();

          const countryById: { [key: string]: string } = {};
          const downloadById: { [key: string]: number } = {};
          const countries = window.topojson.feature(world, world.objects.countries).features;

          countryData.forEach((d: any) => {
            countryById[d.id] = d.name;
            downloadById[d.id] = 0;
          });

          let sumDown = 0;
          // Use the countryDownloads prop instead of file data
          countryDownloads.forEach((d) => {
            if (parseInt(d.id) >= 0) {
              downloadById[d.id] = parseInt(d.count);
              sumDown += parseInt(d.count);
            }
          });

          const downData: number[] = [];
          for (const id in downloadById) {
            if (downloadById[id] > 0) {
              downData.push(downloadById[id]);
            }
          }
          
          let downCat: number[];
          if (downData.length > 0) {
            downCat = window.ss.jenks(downData, 9);
          } else {
            downCat = [];
          }

          scales.jenks9 = window.d3.scale.threshold()
            .domain(downCat)
            .range(window.d3.range(11).map((i: number) => `q${i}-11`));

          scales.quantize = window.d3.scale.quantize()
            .domain([0, sumDown])
            .range(window.d3.range(11).map((i: number) => `q${i}-11`));

          // Drawing 2D globe - exactly like original
          const world2d = svg2d.selectAll(`path.${styles.land}`)
            .data(countries)
            .enter()
            .append('path')
            .attr('class', (d: any) => {
              let down = 0;
              if (d.id in downloadById) {
                down = downloadById[d.id];
              }
              const clr = scales.jenks9(down);
              return `${styles.land} ${styles[clr]}`;
            })
            .attr('d', path2d)
            .on('mouseover', function(d: any) {
              countryTooltip.text(() => {
                let cnt = 0;
                if (d.id in downloadById) {
                  cnt = downloadById[d.id];
                }
                return countryById[d.id] + ': ' + cnt;
              })
                .style('left', (window.d3.event.pageX + 7) + 'px')
                .style('top', (window.d3.event.pageY - 15) + 'px')
                .style('display', 'block')
                .style('opacity', 1);
            });

          // Auto-rotation - exactly like original
          window.d3.timer(() => {
            if (interrupt === false) {
              const dt = Date.now() - t0;
              projection.rotate([velocity[0] * dt + origin[0], velocity[1] * dt + origin[1]]);
              svg.selectAll(`path.${styles.land}`).attr('d', path);
              svg.selectAll('.focused').classed('focused', focused = false);
            }
          });

          // Adding legend - exactly like original
          let legendCat: number[];
          if (downData.length > 0) {
            legendCat = window.ss.jenks(downData, 10);
          } else {
            legendCat = [];
          }

          if (legendCat.length > 0) {
            let legend = svg.selectAll('g.legend')
              .data(legendCat)
              .enter()
              .append('g')
              .attr('class', 'legend');

            const lsW = 20, lsH = 20;

            // For 3D map, position legend in bottom-left corner outside the globe
            legend.append('rect')
              .attr('x', -60)
              .attr('y', (d: number, i: number) => height - 250 - (i * lsH))
              .attr('width', lsW)
              .attr('height', lsH)
              .attr('class', (d: number, i: number) => styles[`q${i}-11`])
              .style('opacity', 0.8);

            legend.append('text')
              .attr('x', -30)
              .attr('y', (d: number, i: number) => height - 250 - ((i + 1) * lsH) + lsH - 4)
              .attr('class', styles.legendText) // Use CSS class for theme-aware styling
              .text((d: number, i: number) => downCat[i]);

            legend = svg2d.selectAll('g.legend')
              .data(legendCat)
              .enter()
              .append('g')
              .attr('class', 'legend');

            // For 2D map, keep legend in bottom-left
            legend.append('rect')
              .attr('x', 10)
              .attr('y', (d: number, i: number) => height - (i * lsH) - 2 * lsH)
              .attr('width', lsW)
              .attr('height', lsH)
              .attr('class', (d: number, i: number) => styles[`q${i}-11`])
              .style('opacity', 0.8);

            legend.append('text')
              .attr('x', 40)
              .attr('y', (d: number, i: number) => height - ((i + 1) * lsH) - lsH - 4)
              .style('fill', getThemeTextColor()) // Theme-aware text color
              .text((d: number, i: number) => downCat[i]);
          }

          // Drawing countries on the globe - exactly like original
          const world3d = svg.selectAll(`path.${styles.land}`)
            .data(countries)
            .enter()
            .append('path')
            .attr('class', (d: any) => {
              let down = 0;
              if (d.id in downloadById) {
                down = downloadById[d.id];
              }
              const clr = scales.jenks9(down);
              return `${styles.land} ${styles[clr]}`;
            })
            .attr('d', path)
            .call(window.d3.behavior.drag()
              .origin(() => {
                interrupt = true;
                const r = projection.rotate();
                return { x: r[0] / sens, y: -r[1] / sens };
              })
              .on('drag', () => {
                const rotate = projection.rotate();
                projection.rotate([window.d3.event.x * sens, -window.d3.event.y * sens, rotate[2]]);
                svg.selectAll(`path.${styles.land}`).attr('d', path);
                svg.selectAll('.focused').classed('focused', focused = false);
              })
              .on('dragend', () => {
                //interrupt = false;
              })
            )
            .on('mouseover', function(d: any) {
              countryTooltip.text(() => {
                let cnt = 0;
                if (d.id in downloadById) {
                  cnt = downloadById[d.id];
                }
                return countryById[d.id] + ': ' + cnt;
              })
                .style('left', (window.d3.event.pageX + 7) + 'px')
                .style('top', (window.d3.event.pageY - 15) + 'px')
                .style('display', 'block')
                .style('opacity', 1);
            })
            .on('mouseout', () => {
              countryTooltip.style('opacity', 0)
                .style('display', 'none');
            })
            .on('mousemove', () => {
              countryTooltip.style('left', (window.d3.event.pageX + 7) + 'px')
                .style('top', (window.d3.event.pageY - 15) + 'px');
            });
        }

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();
  }, [mapView, countryDownloads]);

  return (
    <div style={{ position: 'relative' }}>
      <div 
        ref={mapRef}
        id="geoda_map" 
        style={{ 
          display: mapView === '3d' ? 'block' : 'none',
          width: '100%',
          height: '500px'
        }}
      />
      <div 
        ref={map2dRef}
        id="geoda_map_2d" 
        style={{ 
          display: mapView === '2d' ? 'block' : 'none',
          width: '100%',
          height: '500px'
        }}
      />
    </div>
  );
} 