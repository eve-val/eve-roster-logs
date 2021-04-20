import express = require("express");

export function LOGOUT(req: express.Request, res: express.Response) {
  (req.session as any) = null;
  res.redirect("/");
}
