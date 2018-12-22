import * as fs from 'fs';
import * as path from 'path';

let rootPathVerified = false;
const rootPath = process.cwd();

export function getRootPath() {
  if (!rootPathVerified) {
    if (fs.existsSync(path.join(process.cwd(), 'package.json'))) {
      rootPathVerified = true;
    } else {
      throw new Error(`Cannot find package.json in process.cwd.`);
    }
  }
  return rootPath;
}
