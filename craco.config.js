const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add Cesium webpack configuration
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib')
      };

      // Copy Cesium assets
      webpackConfig.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            { 
              from: path.join(path.dirname(require.resolve('cesium')), '..', 'Build', 'Cesium', 'Workers'),
              to: 'Workers'
            },
            { 
              from: path.join(path.dirname(require.resolve('cesium')), '..', 'Build', 'Cesium', 'Assets'),
              to: 'Assets'
            },
            { 
              from: path.join(path.dirname(require.resolve('cesium')), '..', 'Build', 'Cesium', 'ThirdParty'),
              to: 'ThirdParty'
            }
          ]
        })
      );

      return webpackConfig;
    }
  }
};
