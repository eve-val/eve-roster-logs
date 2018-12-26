import envalid from 'envalid';
import webpack from 'webpack';
import merge from 'webpack-merge';
import commonConfig from './webpack.common';

const env = envalid.cleanEnv(process.env, {}, { strict: true });

let modeSpecificConfig =
    env.isProd ? require('./webpack.prod') : require('./webpack.dev');

const mode = env.isProd ? 'production' : 'development';

// Because we called require() instead of import, modeSpecificConfig is the
// raw module object. However, because the module was declared using ES6
// syntax, Typescript has put the actual object we want on
// modeSpecificConfig.default. So we need to reference that:
const config = merge.smart(commonConfig, modeSpecificConfig.default, {
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

export default config;
