import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Using user's Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoicHlybzEwIiwiYSI6ImNtNDZsNTBiaDBtNG0ya29qaHlhNnp4YnUifQ.TRy-AjoNmBiwT3fIZyMiEw';

const MINE_LOCATION = {
    longitude: 120.4577531,
    latitude: -29.1797867
};

const LAYER_STYLES = {
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    terrain: 'mapbox://styles/mapbox/satellite-v9',
    streets: 'mapbox://styles/mapbox/streets-v12'
};

const TerrainMap = () => {
    const mapRef = useRef();
    const mapInstance = useRef();
    const [elevation, setElevation] = useState(null);
    const [currentStyle, setCurrentStyle] = useState('satellite');
    const [terrainExaggeration, setTerrainExaggeration] = useState(1.5);
    const [isStyleLoaded, setIsStyleLoaded] = useState(false);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = new mapboxgl.Map({
            container: mapRef.current,
            style: LAYER_STYLES[currentStyle],
            center: [MINE_LOCATION.longitude, MINE_LOCATION.latitude],
            zoom: 14,
            pitch: 60,
            bearing: -45,
            antialias: true
        });

        map.on('style.load', () => {
            setIsStyleLoaded(true);

            // Add terrain source
            if (!map.getSource('mapbox-dem')) {
                map.addSource('mapbox-dem', {
                    'type': 'raster-dem',
                    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                    'tileSize': 512,
                    'maxzoom': 14
                });
            }

            // Add 3D terrain
            map.setTerrain({
                'source': 'mapbox-dem',
                'exaggeration': terrainExaggeration
            });

            // Add sky layer
            if (!map.getLayer('sky')) {
                map.addLayer({
                    'id': 'sky',
                    'type': 'sky',
                    'paint': {
                        'sky-type': 'atmosphere',
                        'sky-atmosphere-sun': [0.0, 90.0],
                        'sky-atmosphere-sun-intensity': 15
                    }
                });
            }

            // Get elevation data
            const query = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${Math.floor(map.getZoom())}/${Math.floor(map.getCenter().lng)}/${Math.floor(map.getCenter().lat)}.pngraw?access_token=${mapboxgl.accessToken}`;
            fetch(query)
                .then(response => response.arrayBuffer())
                .then(data => {
                    const arr = new Uint8Array(data);
                    const height = -10000 + ((arr[0] * 256 * 256 + arr[1] * 256 + arr[2]) * 0.1);
                    setElevation(Math.round(height));
                })
                .catch(error => console.error('Error fetching elevation:', error));
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.FullscreenControl());

        // Add marker and popup
        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        })
        .setLngLat([MINE_LOCATION.longitude, MINE_LOCATION.latitude])
        .setHTML(`
            <div style="padding: 10px;">
                <h3 style="margin: 0 0 8px 0;">Open Pit Mine</h3>
                <p style="margin: 0;">
                    <strong>Latitude:</strong> ${MINE_LOCATION.latitude}°<br>
                    <strong>Longitude:</strong> ${MINE_LOCATION.longitude}°<br>
                    <strong>Elevation:</strong> ${elevation !== null ? `${elevation}m` : 'Loading...'}
                </p>
            </div>
        `)
        .addTo(map);

        new mapboxgl.Marker({
            color: '#FF0000'
        })
        .setLngLat([MINE_LOCATION.longitude, MINE_LOCATION.latitude])
        .addTo(map);

        mapInstance.current = map;

        return () => {
            map.remove();
            setIsStyleLoaded(false);
        };
    }, [currentStyle, elevation, terrainExaggeration]);

    const handleStyleChange = (style) => {
        setCurrentStyle(style);
    };

    const handleTerrainChange = (value) => {
        if (mapInstance.current && isStyleLoaded) {
            const newValue = parseFloat(value);
            setTerrainExaggeration(newValue);
            mapInstance.current.setTerrain({
                'source': 'mapbox-dem',
                'exaggeration': newValue
            });
        }
    };

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            
            {/* Controls Panel */}
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'white',
                padding: '10px',
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 1000
            }}>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Map Style:</strong>
                </div>
                {Object.entries(LAYER_STYLES).map(([key]) => (
                    <label key={key} style={{ display: 'block', margin: '5px 0' }}>
                        <input
                            type="radio"
                            name="mapStyle"
                            checked={currentStyle === key}
                            onChange={() => handleStyleChange(key)}
                        />
                        {' '}
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                ))}

                <div style={{ marginTop: '10px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
                    <label>
                        Terrain Height:
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={terrainExaggeration}
                            style={{ width: '100%' }}
                            onChange={(e) => handleTerrainChange(e.target.value)}
                        />
                    </label>
                </div>
            </div>

            {/* Controls help overlay */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 1000,
                maxWidth: '300px'
            }}>
                <div style={{ 
                    fontSize: '13px', 
                    color: '#666'
                }}>
                    Map Controls:<br/>
                    • Click and drag to pan<br/>
                    • Right-click + drag to rotate<br/>
                    • Scroll to zoom in/out<br/>
                    • Use layer switcher to change views<br/>
                    • Adjust terrain height with slider<br/>
                    • Click fullscreen button to expand<br/>
                    {elevation !== null && `• Current Elevation: ${elevation}m`}
                </div>
            </div>
        </div>
    );
};

export default TerrainMap;
