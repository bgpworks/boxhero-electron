const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    boxhero: './src/react/index.tsx',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    path: path.join(__dirname, '/out'),
    chunkFilename: '[name].[chunkhash].js',
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: './src/react/tsconfig.json',
          useCache: true,
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['*.js', 'index.html'],
    }),
    new HtmlWebpackPlugin({
      template: './templates/main.html',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../last-bundle-info.html',
      openAnalyzer: false,
    }),
  ],
  externals: {
    electron: 'electron',
  },
  watchOptions: {
    ignored: ['src/electron/**', 'node_modules/**'],
  },
  ...(!isDev
    ? {
        optimization: {
          splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '.',
            cacheGroups: {
              default: false,
              main: {
                automaticNamePrefix: 'main',
                test: /([\\/]src[\\/]react[\\/])|([\\/]locale[\\/])/,
                enforce: true,
                priority: 3,
              },
              react: {
                automaticNamePrefix: 'react',
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                enforce: true,
                priority: 2,
              },
            },
          },
        },
      }
    : {}),
};
