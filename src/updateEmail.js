import { readAndRun, readFile } from "./runAllEmail.js";

const jsonData = readFile('./src/json/email.json', 'utf8');
const update = JSON.parse(jsonData);

const selections = {replaceId: false, flatten: false, update};

readAndRun('./src/html/email.html', `src/html/updatedemail.html`, selections);
