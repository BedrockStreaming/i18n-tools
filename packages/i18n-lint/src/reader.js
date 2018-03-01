import fs from 'fs';

export default class JSONReader {
  parse(folderName, fileName) {
    try {
      const path = `${folderName}/${fileName}`;

      let text = fs.readFileSync(path, 'utf-8');
      return JSON.parse(text);
    } catch (e) {
      console.log('######## error', e);
    }
  }
}
