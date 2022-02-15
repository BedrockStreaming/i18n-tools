import fs from 'fs';
import path from 'path';

export default class ConfigLoader {
  static detect() {
    return ['.eslintrc.js', '.eslintrc.json'].find(filename => fs.existsSync(filename));
  }

  static load(filePath) {
    const extension = path.extname(filePath);
    switch (extension) {
      case '.json':
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      case '.js':
        // eslint-disable-next-line import/no-dynamic-require,global-require
        return require(filePath);
      default:
        throw new Error(`Unsupported extension : ${extension}`);
    }
  }
}
