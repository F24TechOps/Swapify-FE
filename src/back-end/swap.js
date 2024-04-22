import { copyFolder, readAndRun, readFile } from "./runAllMicrosite.js";

const type = process.argv[2];
const company = process.argv[3] ?? 'force';

const jsonData = readFile(`./.env/${company}/${type}/json/mapping.json`, 'utf8');
const update = JSON.parse(jsonData);

const selections = {replaceId: false, flatten: false, update};

readAndRun(`./src/html/${type}/base1/template.html`, `./.env/${company}/${type}/final/template.html`, selections, type);

if (type === 'email') {
    copyFolder(`./src/html/${type}/base1/images`, `./.env/${company}/${type}/final/images`);
}