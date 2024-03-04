import { flatten } from "./flattener.js";
import { replaceId } from "./replacer.js";
import { updateHtmlContent } from "./background.js";
import fs from 'fs';

export function runAll (html, selections) {
    if (selections.flatten)
        html = flatten(html);

    if (selections.replaceId)
        html = replaceId(html);

    if (selections.update)
        html = updateHtmlContent(html, selections.update)

    return html;
}

export function readAndRun(inputPath, outputPath, selections) {
    const html = readFile(inputPath);

    const newHtml = runAll(html, selections);

    writeFile(outputPath, newHtml);
}

export function readFile (filePath) {
    return fs.readFileSync(filePath, 'utf8');
};
  
function writeFile (filePath, data) {
    fs.writeFileSync(filePath, data, 'utf8');
};
