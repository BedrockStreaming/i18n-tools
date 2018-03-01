import fs from 'fs';

export default class ConfigLoader {
  load(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
}
