import { createMapping } from "./mapping.js";
import { readFile, writeFile } from "./runAllMicrosite.js";

const html = readFile('./src/html/email.html');

const mapping = await createMapping(html, 'email');

writeFile('./src/json/microsite4.json', JSON.stringify(mapping, null, 2));
