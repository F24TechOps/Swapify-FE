import { readAndRun, readFile } from "./runAllMicrosite.js";

const jsonData = readFile('./src/json/microsite4.json', 'utf8');
const update = JSON.parse(jsonData);

const selections = {replaceId: true, flatten: true, update};

readAndRun('./src/html/microsite.html', `src/html/dairymicrosite.html`, selections, 'microsite');
