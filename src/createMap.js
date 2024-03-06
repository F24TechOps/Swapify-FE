import { createMapping } from "./mapping.js";
import { readFile, writeFile } from "./runAll.js";

const html = readFile('./src/html/microsite.html');

const mapping = await createMapping(html);

writeFile('./src/json/microsite.json', JSON.stringify(mapping, null, 2));