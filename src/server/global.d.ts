import { RouteContext } from "./route/express";
import { AuthSession } from "./auth/AuthSession";

declare global {
  namespace Express {
    export interface Response {
      // We inject this attribute into the Response object in express.ts so
      // that it's available to all routes
      context: RouteContext;
    }

    export interface Request {
      session: AuthSession | undefined;
    }
  }
}
