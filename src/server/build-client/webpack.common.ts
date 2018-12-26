import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import { getRootPath } from '../util/getRootPath';
import webpack = require('webpack');
const VueLoaderPlugin  = require('vue-loader/lib/plugin');


// Much of this is based on the Typescript Vue Starter page,
// https://github.com/Microsoft/TypeScript-Vue-Starter
// Sadly, some of the page is out of date.

// See https://webpack.js.org/configuration/ for docs on this config format.

const PROJECT_ROOT = getRootPath();
const CLIENT_SRC_ROOT = path.resolve(PROJECT_ROOT, 'src/client');
const OUT_ROOT = path.resolve(PROJECT_ROOT, 'built/client');

const config: webpack.Configuration = {

  // Main entry point of the app; the transitive dependencies of this file
  // determine what we compile.
  entry: [path.join(CLIENT_SRC_ROOT, 'main.ts')],

  output: {
    // Directory to write compiled JS and any static assets to
    path: OUT_ROOT,

    // File to write compiled JS to (plus any CSS)
    filename: 'bundle.js',

    // Public URL where compiled assets will be hosted (so they can refer to
    // one another).
    publicPath: '/dist/',
  },

  module: {
    rules: [

      // Compilation for Vue single file components (*.vue)
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },

      // Compilation for Typescript files
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: path.join(CLIENT_SRC_ROOT, 'tsconfig.json'),
          appendTsSuffixTo: [/\.vue$/],
        },
      },

      // CSS processing (for both .vue files and normal .css files)
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },

      // Images
      // TODO: Check if we want to include the hash here
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
    ]
  },

  plugins: [
    // Cleans up any obsolete build artifacts (e.g. images that have since been
    // deleted).
    new CleanWebpackPlugin([OUT_ROOT], { verbose: false }),

    // Required for loading .vue files
    new VueLoaderPlugin(),
  ],

  resolve: {
    // Files with these extensions can be imported without specifying the
    // extension (e.g. './foo' vs. './foo.ts');
    extensions: [ '.tsx', '.ts', '.js', '.json' ],

    alias: {
      // Import alias. Causes `import vue from 'vue'` to point to precompiled
      // vue distributable.
      // The $ indicates an exact match is required.
      'vue$': 'vue/dist/vue.esm.js'
    },
  },
};

export default config;
