import querystring from "querystring";
import express = require("express");
import { API } from "./api";
import { AUTHENTICATE } from "./authenticate";
import { ClientConfig } from "../../shared/ClientConfig";
import { Env } from "../env";
import { LOGOUT } from "./logout";

export function initializeRoutes(app: express.Express) {
  app.get("/", INDEX);
  app.get("/login", INDEX);
  app.get("/logs", INDEX);
  app.get("/logs/:path*", INDEX);

  app.get("/authenticate", AUTHENTICATE);
  app.get("/logout", LOGOUT);

  app.use("/api", API);
}

function INDEX(req: express.Request, res: express.Response) {
  const payload: ClientConfig = {
    loginUrlParams: buildLoginParams(res.context.env),
  };
  const escapedPayload = JSON.stringify(payload).replace(/</g, "\\u003c");

  res.render("main", { escapedPayload });
}

function buildLoginParams(env: Env) {
  const protocol = env.isProd ? "https" : "http";
  const port = env.isDev ? `:${env.PORT}` : "";

  return querystring.stringify({
    response_type: "code",
    redirect_uri: `${protocol}://${env.PUBLIC_HOSTNAME}${port}/authenticate`,
    client_id: env.SSO_CLIENT_ID,
    scope: [
      "publicData",
      "esi-characters.read_corporation_roles.v1",
      "esi-characters.read_titles.v1",
    ].join(" "),
  });
}
