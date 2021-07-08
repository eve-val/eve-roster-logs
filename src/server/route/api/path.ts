import * as path from "path";
import * as fs from "fs";
import express = require("express");
import { DirEntryJson } from "../../../shared/routes/DirEntryJson";
import { writeJson } from "../../util/writeJson";
import { sanitizePath } from "../../util/sanitizePath";
import { BadRequestError } from "../../error/BadRequestError";

export function API_PATH(
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
        // TODO throw 404
        next(new Error(`Not found: "${rawPath}"`));
      } else {
        console.error("ERROR when lstating", absPath);
        console.error(err);
        next(err);
      }
    } else {
      if (stat.isDirectory()) {
        fs.readdir(absPath, { withFileTypes: true }, (err, files) => {
          if (err) {
            next(err);
          } else {
            writeJson(req, res, dirToJson(sanitizedPath, files));
          }
        });
      } else if (stat.isFile()) {
        res.sendFile(absPath);
      } else {
        throw new Error(`Cannot serve this file.`);
      }
    }
  });
}

function dirToJson(dirname: string, files: fs.Dirent[]) {
  const out: DirEntryJson[] = [];

  for (const file of files) {
    out.push({
      path: path.join(dirname, file.name),
      name: file.name,
      dirname: dirname,
      type: file.isFile() ? "file" : file.isDirectory() ? "directory" : "other",
    });
  }

  return out;
}
