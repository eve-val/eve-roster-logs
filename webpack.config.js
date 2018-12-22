const envalid = require('envalid');
const webpack = require('webpack');
const merge = require('webpack-merge');

const env = envalid.cleanEnv(process.env, {}, { strict: true });

const commonConfig = require('./webpack.common.js');
let modeSpecificConfig =
    env.isProd ? require('./webpack.prod') : require('./webpack.dev');

const mode = env.isProd ? 'production' : 'development';

module.exports = merge.smart(commonConfig, modeSpecificConfig, {
  mode: mode,

  plugins: [
    // Hard-code these constants in the compiled code. Allows for tree-shaking
    // to completely remove dev-specific branches.
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(env.isProd),
      DEVELOPMENT: JSON.stringify(env.isDev),
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
  ],
});
