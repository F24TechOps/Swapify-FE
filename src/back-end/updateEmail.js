import { readAndRun, readFile } from "./runAllMicrosite.js";

const companyName = 'force24';

const jsonData = readFile('./.env/original.json', 'utf8');
const update = JSON.parse(jsonData);

const selections = {replaceId: false, flatten: true, update};

<<<<<<< HEAD
readAndRun('./.env/original.html', `./.env/force/template.html`, selections, 'email');
=======
readAndRun('./src/html/email2.html', `src/html/updatedemail3.html`, selections, 'email');
>>>>>>> 2bccceb (delete unused html)
