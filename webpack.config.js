// NOTE: To use this example standalone (e.g. outside of repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const path = require('path');
const resolve = require('path').resolve;
const webpack = require('webpack');
HtmlWebpackPlugin = require('html-webpack-plugin');
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const config = {
  mode: 'development',

  devServer: {
    static: '.'
  },

  output: {
    library: 'App',
    path: path.resolve(__dirname, 'build'),
    clean: true
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        include: [resolve('.')],
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env', '@babel/react']
            }
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader,"style-loader", "css-loader"],
        exclude: [/node_modules/],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
    }
    ]
  },
  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new webpack.EnvironmentPlugin({MapboxAccessToken: ''}),
    new HtmlWebpackPlugin({
      title: 'react-map-gl Example',
      inject: true,
      filename: "index.html",

    })
  ]

};

// Enables bundling against src in this repo rather than the installed version
module.exports = env =>
  env && env.local ? require('../webpack.config.local')(config)(env) : config;