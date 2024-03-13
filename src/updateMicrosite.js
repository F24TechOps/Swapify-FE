import { readAndRun, readFile } from "./runAllMicrosite.js";

const jsonData = readFile('./src/json/microsite2.json', 'utf8');
const update = JSON.parse(jsonData);

const selections = {replaceId: true, flatten: true, update};

readAndRun('./src/html/microsite2.html', `src/html/updatedmicrosite2.html`, selections, 'microsite');
