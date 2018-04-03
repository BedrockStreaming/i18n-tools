import fs from 'fs';

export default class JSONReader {
  static parse(folderName, fileName) {
    try {
      const path = `${folderName}/${fileName}`;

      const text = fs.readFileSync(path, 'utf-8');

      return JSON.parse(text);
    } catch (e) {
      console.log('######## error', e);

      return null;
    }
  }
}
