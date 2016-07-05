/**
 * Function that returns default values.
 * Used because Object.assign does a shallow instead of a deep copy.
 * Using [].push will add to the base array, so a require will alter
 * the base array output.
 */
'use strict';

const path = require('path');
const srcPath = path.join(__dirname, '/../src');
const dfltPort = 8000;

/**
 * Get the default modules object for webpack
 * @return {Object}
 */
function getDefaultModules() {
  return {
    preLoaders: [
      {
        test: /\.jsx?$/,
        include: srcPath,
        //loader: 'babel!eslint',
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      }
    ],
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      }, {
        test: /\.less/,
        loader: 'style!css!less'
      }, {
        test: /\.(png|jpg|gif|woff|woff2|eot|otf|ttf|svg)$/,
        loader: 'url?limit=8192'
      }, {
        test: /\.json/,
        loader: 'json'
      }
    ]
  };
}

module.exports = {
  srcPath: srcPath,
  publicPath: '/assets/',
  port: dfltPort,
  getDefaultModules: getDefaultModules
};
