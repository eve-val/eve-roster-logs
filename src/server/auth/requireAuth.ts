import express = require("express");
import moment from "moment";

export function requireAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (!req.session || req.session.authenticated == undefined) {
    res.sendStatus(401);
  } else {
    const session = req.session;
    if (moment().diff(moment(session.authenticated)) > MAX_AUTH_VALIDITY) {
      clearSession(req);
      res.sendStatus(401);
    } else {
      next();
    }
  }
}

const MAX_AUTH_VALIDITY = moment.duration(1, "day").asMilliseconds();

function clearSession(req: express.Request) {
  (req.session as any) = null;
}
