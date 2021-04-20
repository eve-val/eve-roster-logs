import merge from 'webpack-merge';
import { commonConfig } from './webpack.common';
import { getProjectPaths } from './paths';
import webpack from 'webpack';

const paths = getProjectPaths();
const config: webpack.Configuration = merge(
  commonConfig('production', paths),
  {
    // Webpack 4 minifies code automatically when mode='production', so nothing
    // more to do here.
    // TODO: Host source file from server so this will work
    // devtool: 'nosources-source-map',
  },
);

export default config;
