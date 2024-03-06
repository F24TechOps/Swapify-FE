import { readAndRun, readFile } from "./runAll.js";

const jsonData = readFile('./src/json/microsite2.json', 'utf8');
const update = JSON.parse(jsonData);

const selections = {replaceId: true, flatten: true, update};

readAndRun('./src/html/microsite2.html', `src/html/updatedmicrosite${Date.now()}.html`, selections);
