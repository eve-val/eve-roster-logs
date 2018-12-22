import { Env } from './env';
import { RouteContext } from './route/express';

declare global {
  namespace Express {
    export interface Response {
      // We inject this attribute into the Response object in express.ts so
      // that it's available to all routes
      context: RouteContext,
    }
  }
}
