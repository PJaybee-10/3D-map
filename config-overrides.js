const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function override(config) {
    // Remove the existing copy plugin if it exists
    config.plugins = config.plugins.filter(plugin => !(plugin instanceof CopyWebpackPlugin));

    // Add CESIUM_BASE_URL
    config.plugins = config.plugins || [];
    config.plugins.push(
        new webpack.DefinePlugin({
            CESIUM_BASE_URL: JSON.stringify('')
        })
    );

    // Configure node polyfills
    config.resolve.fallback = {
        ...config.resolve.fallback,
        https: require.resolve('https-browserify'),
        http: require.resolve('stream-http'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util'),
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
    };

    // Configure Cesium asset loading
    config.module.rules.push({
        test: /\.(glb|gltf)$/,
        use: ['file-loader']
    });

    config.module.rules.push({
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
    });

    // Add Cesium source alias
    config.resolve.alias = {
        ...config.resolve.alias,
        cesium: path.resolve(__dirname, 'node_modules/cesium/Source')
    };

    return config;
};
