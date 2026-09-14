const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname, './');

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'web/index.js'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, 'App.tsx'),
    path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
    path.resolve(appDirectory, 'node_modules/@rneui'),
    path.resolve(appDirectory, 'node_modules/react-native-calendars'),
    path.resolve(appDirectory, 'node_modules/react-native-ratings'),
    path.resolve(appDirectory, 'node_modules/react-native-raw-bottom-sheet'),
    path.resolve(appDirectory, 'node_modules/react-native-snap-carousel'),
    path.resolve(appDirectory, 'node_modules/react-native-webview'),
    path.resolve(appDirectory, 'node_modules/react-native-timer-picker'),
    path.resolve(appDirectory, 'node_modules/@react-navigation'),
    path.resolve(appDirectory, 'node_modules/react-native-reanimated'),
    path.resolve(appDirectory, 'node_modules/react-native-swipe-gestures'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
        'module:metro-react-native-babel-preset',
      ],
      plugins: [
        'react-native-web',
      ],
    },
  },
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    }
  }
};

const fontLoaderConfiguration = {
  test: /\.ttf$/,
  loader: 'url-loader', // or file-loader
  include: path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
};

module.exports = {
  entry: [
    // load any web API polyfills
    path.resolve(appDirectory, 'web/index.js'),
  ],
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'dist'),
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      fontLoaderConfiguration,
    ],
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native-reanimated$': path.resolve(__dirname, 'web/mocks/react-native-reanimated.js'),
      'react-native-restart$': path.resolve(__dirname, 'web/mocks/react-native-restart.js'),
      'react-native-gesture-handler': path.resolve(__dirname, 'web/mocks/react-native-gesture-handler.js'),
      'react-native-web/dist/exports/ViewPropTypes': path.resolve(__dirname, 'web/mocks/ViewPropTypes.js'),
      'react-native-web/dist/index': path.resolve(__dirname, 'web/mocks/react-native.js'),
      '@react-native-firebase/app': path.resolve(__dirname, 'web/mocks/react-native-firebase.js'),
      '@react-native-firebase/auth': path.resolve(__dirname, 'web/mocks/react-native-firebase.js'),
      '@react-native-firebase/messaging': path.resolve(__dirname, 'web/mocks/react-native-firebase.js'),
    },
    extensions: ['.web.js', '.js', '.web.jsx', '.jsx', '.web.ts', '.ts', '.web.tsx', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(appDirectory, 'web/index.html'),
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
      'process.env': JSON.stringify({ NODE_ENV: process.env.NODE_ENV || 'development' }),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    historyApiFallback: true,
  },
};
