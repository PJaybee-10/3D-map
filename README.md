# 3D Mining Location Visualization

An interactive 3D map visualization of an open-pit mining location in Australia, built with React and Mapbox GL JS.

## Project Overview

This project provides an interactive 3D visualization of a mining site located at:
- Latitude: -29.1797867
- Longitude: 120.4577531

### Features

1. **3D Terrain Visualization**
   - Real-time terrain elevation data
   - Adjustable terrain height (exaggeration slider)
   - Multiple map style options
   - Sky layer for enhanced 3D effect

2. **Interactive Controls**
   - Pan and rotate map view
   - Zoom functionality
   - Layer style switcher
   - Fullscreen mode
   - Terrain height adjustment slider

3. **Location Information**
   - Red marker at mining location
   - Popup with coordinates
   - Real-time elevation display

### Map Styles
- Satellite with street labels
- Pure satellite view
- Street view

## Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- A Mapbox account with access token

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Mapbox token:
```
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
```

4. Start the development server:
```bash
npm start
```

## Usage

1. **Map Navigation**
   - Click and drag to pan
   - Right-click + drag to rotate view
   - Scroll to zoom in/out
   - Use the fullscreen button to expand

2. **Style Switching**
   - Use radio buttons to switch between map styles
   - Choose from satellite, terrain, or street views

3. **Terrain Adjustment**
   - Use the slider to adjust terrain height
   - Range from 0.5x to 3x exaggeration

## Technical Stack

- **Frontend Framework**: React
- **Mapping Library**: Mapbox GL JS
- **Styling**: CSS
- **Package Management**: npm

## Dependencies

- react: ^18.2.0
- mapbox-gl: Latest version
- Other React dependencies

## Project Structure

```
3d-map/
├── src/
│   ├── components/
│   │   └── TerrainMap.js    # Main map component
│   ├── App.js
│   └── index.js
├── public/
├── package.json
└── README.md
```

## Future Enhancements

1. **Additional Features**
   - Multi-layer geological analysis
   - Historical imagery comparison
   - Advanced measurement tools
   - Custom overlay capabilities

2. **Performance Optimizations**
   - Caching for elevation data
   - Optimized terrain rendering
   - Better error handling

3. **UI Improvements**
   - More detailed geological information
   - Enhanced navigation controls
   - Custom styling options

## Browser Support

Tested and working on:
- Google Chrome (recommended)
- Firefox
- Edge

## Notes

- The location is in a remote area of Australia
- Terrain visualization quality depends on available elevation data
- Performance may vary based on internet connection and device capabilities

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

