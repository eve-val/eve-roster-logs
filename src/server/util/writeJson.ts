import express = require('express');

export function writeJson(
    req: express.Request,
    res: express.Response,
    json: object | string | number | boolean,
    ) {
  const pretty = req.query.pretty !== undefined;
  res.type('json');
  res.send(JSON.stringify(json, undefined, pretty ? 2 : undefined));
  res.end();
}
