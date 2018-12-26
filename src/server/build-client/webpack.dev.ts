import webpack from 'webpack';

const config = {
  // Add another entry point to make sure we include the HMR client (this will
  // be in addition to main.ts, which is defined in common)
  entry: ['webpack-hot-middleware/client'],

  // Expose source maps to browser dev tools. Many options here, see docs for
  // difference trade-offs.
  devtool: 'cheap-module-eval-source-map',

  plugins: [
    // Allows for code replacement without page refresh
    new webpack.HotModuleReplacementPlugin(),
  ],
};

export default config;
