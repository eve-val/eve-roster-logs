import * as path from "path";
import * as fs from "fs";
import express = require("express");
import { DirEntryJson } from "../../../shared/routes/DirEntryJson";
import { writeJson } from "../../util/writeJson";
import { sanitizePath } from "../../util/sanitizePath";
import { BadRequestError } from "../../error/BadRequestError";
import { NotFoundError } from "../../error/NotFoundError";

export function API_STAT(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const rawPath: string = req.params[0];
  const sanitizedPath = sanitizePath(rawPath);
  if (sanitizedPath == null) {
    throw new BadRequestError(`Invalid path "${rawPath}".`);
  }
  const absPath = path.join(res.context.env.ROOT_DIR, sanitizedPath);

  fs.lstat(absPath, (err, stat) => {
    if (err) {
      if (err.code == "ENOENT") {
        next(new NotFoundError(`Not found: "${rawPath}"`));
      } else {
        next(err);
      }
    } else {
      const json: DirEntryJson = {
        path: sanitizedPath,
        name: path.basename(sanitizedPath),
        dirname: path.dirname(sanitizedPath),
        type: stat.isFile()
          ? "file"
          : stat.isDirectory()
          ? "directory"
          : "other",
      };
      writeJson(req, res, json);
    }
  });
}
