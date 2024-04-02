import { readAndRun, readFile } from "./runAllMicrosite.js";

const jsonData = readFile('./src/json/email2.json', 'utf8');
const update = JSON.parse(jsonData);

const selections = {replaceId: false, flatten: false, update};

readAndRun('./src/html/email2.html', `src/html/updatedemail2.html`, selections, 'email');
