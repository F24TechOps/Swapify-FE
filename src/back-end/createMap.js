import { createMapping } from "./mapping.js";
import { readFile, writeFile } from "./runAllMicrosite.js";

const html = readFile('./src/html/microsite/base1/microsite.html');

const mapping = await createMapping(html, 'microsite');

writeFile('./.env/json/microsite.json', JSON.stringify(mapping, null, 2));
