import { createMapping } from "./mapping.js";
import { readFile, writeFile } from "./runAllMicrosite.js";

const html = readFile('./src/html/email.html');

const mapping = await createMapping(html, 'email');

writeFile('./.env/switalskis/original.json', JSON.stringify(mapping, null, 2));