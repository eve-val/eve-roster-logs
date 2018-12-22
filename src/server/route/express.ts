
import * as path from 'path';
import express = require('express');
import webpack = require('webpack');
import webpackDevMiddleware = require('webpack-dev-middleware');
import webpackHotMiddleware = require('webpack-hot-middleware');
import { Env } from '../env';
import { getRootPath } from '../util/getRootPath';
import { API_PATH } from './api/path';
import { API_STAT } from './api/stat';
import { BadRequestError } from '../error/BadRequestError';
import { NotFoundError } from '../error/NotFoundError';


export async function serve(env: Env) {
  const projectRoot = getRootPath();

  const app = express();

  const context: RouteContext = {
    env,
    projectRoot,
  };

  // Inject dependencies
  app.use((req, res, next) => {
    res.context = context;
    next();
  });

  app.get('/api/path/*', API_PATH);
  app.get('/api/stat/*', API_STAT);

  app.get('/', serveIndex);
  // TODO: Only scope this to front-end routes that we actually declare
  app.get('/logs/:path*', serveIndex);

  // Handle certain errors thrown by our routes
  app.use(
      (err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction) => {
    if (err instanceof BadRequestError) {
      res.status(400).send('Bad request');
    } else if (err instanceof NotFoundError) {
      res.status(404).send('Not found');
    } else {
      next();
    }
  });

  const config = require(path.join(projectRoot, 'webpack.config.js'));

  // Serve compiled client files
  app.use(
    config.output.publicPath,
    express.static(path.join(projectRoot, 'built/client/')));

  // Compile client
  const compiler = webpack(config);
  if (env.isProd) {
    console.log('Compiling client...');
    const stats = await compileClient(compiler);
  } else if (env.isDev) {
    app.use(webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    }));
    app.use(webpackHotMiddleware(compiler));
  } else {
    throw new Error(`Unrecognized NODE_ENV "${process.env.NODE_ENV}".`);
  }

  // Start server
  app.listen(env.PORT, () => {
    console.log(`Serving from http://localhost:${env.PORT}`);
    console.log('');
  });
}

function serveIndex(req: express.Request, res: express.Response) {
  res.sendFile('srv/index.html', {
    root: res.context.projectRoot,
  });
}

function compileClient(compiler: webpack.Compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}

export interface RouteContext {
  env: Env,
  projectRoot: string,
}
