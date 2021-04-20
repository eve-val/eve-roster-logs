import * as path from "path";
import moment from "moment";
import express = require("express");
import cookieSession = require("cookie-session");
import webpack = require("webpack");
import webpackDevMiddleware = require("webpack-dev-middleware");
import webpackHotMiddleware = require("webpack-hot-middleware");
import { Env } from "../env";
import { getRootPath } from "../util/getRootPath";
import { BadRequestError } from "../error/BadRequestError";
import { NotFoundError } from "../error/NotFoundError";
import webpackConfig from "../build-client/webpack.config";
import { checkNotNil } from "../../shared/util/checkNotNil";
import mustacheExpress = require("mustache-express");
import { initializeRoutes } from "./routes";

export async function serve(env: Env) {
  const projectRoot = getRootPath();
  const publicPath = checkNotNil(checkNotNil(webpackConfig.output).publicPath);

  const app = express();

  // Set up HTML templating engine
  app.engine("mst", mustacheExpress());
  app.set("view engine", "mst");
  app.set("views", path.join(projectRoot, "templates"));

  // Track sessions using a signed cookie
  app.use(
    cookieSession({
      secret: env.SESSION_SECRET,
      maxAge: moment.duration(1, "day").asMilliseconds(),
      sameSite: true,
    })
  );

  // Inject dependencies
  const context: RouteContext = {
    env,
    projectRoot,
  };
  app.use((req, res, next) => {
    res.context = context;
    next();
  });

  // Handle certain errors thrown by our routes
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (err instanceof BadRequestError) {
        res.status(400).send("Bad request");
      } else if (err instanceof NotFoundError) {
        res.status(404).send("Not found");
      } else {
        console.error(`Error handling "${req.url}":`);
        console.error(err);
        next();
      }
    }
  );

  // Compile client
  const compiler = webpack(webpackConfig);
  if (env.isProd) {
    console.log("Compiling client...");
    const stats = await compileClient(compiler);
    if (stats.hasErrors()) {
      throw new Error(
        `Error while compiling client: ${stats.toString("errors-only")}`
      );
    }
  } else if (env.isDev) {
    app.use(
      webpackDevMiddleware(compiler, {
        publicPath: publicPath,
      })
    );
    app.use(webpackHotMiddleware(compiler));
  } else {
    throw new Error(`Unrecognized NODE_ENV "${process.env.NODE_ENV}".`);
  }

  // Serve compiled client files
  app.use(publicPath, express.static(path.join(projectRoot, "built/client/")));

  // Register routes
  initializeRoutes(app);

  // Start server
  app.listen(env.PORT, () => {
    console.log(`Serving from http://${env.PUBLIC_HOSTNAME}:${env.PORT}`);
    console.log("");
  });
}

function compileClient(compiler: webpack.Compiler) {
  return new Promise<webpack.Stats>((resolve, reject) => {
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
  env: Env;
  projectRoot: string;
}
