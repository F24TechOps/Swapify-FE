import { readAndRun, readFile } from "./runAll.js";

const jsonData = readFile('../.env/json/microsite.json', 'utf8');
const update = JSON.parse(jsonData);

const selections = {replaceId: true, flatten: true, update};

readAndRun('../html/microsite/base1/template.html', `../.env/microsite.html`, selections, 'microsite');
