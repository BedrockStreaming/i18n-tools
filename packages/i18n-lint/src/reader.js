import fs from 'fs';

export default class JSONReader {
  static parse(filePath) {
    try {
      const text = fs.readFileSync(filePath, 'utf-8');

      return JSON.parse(text);
    } catch (e) {
      console.log('######## error', e);

      return null;
    }
  }
}
