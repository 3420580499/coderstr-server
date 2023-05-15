import * as fs from 'fs';
import * as path from 'path';

export function createDirectoryIfNotExist(dirPath) {
  if (fs.existsSync(dirPath)) {
    return true;
  }
  createDirectoryIfNotExist(path.dirname(dirPath));
  fs.mkdirSync(dirPath);
}
