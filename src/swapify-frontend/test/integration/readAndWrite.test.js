import tmp from 'tmp';
import { readAndRun, readFile } from '../../back-end/runAll.js';
import { reformatHtml } from '../helpers/testfunctions.js';
import { extractId } from '../../back-end/extractor.js';

describe('read and write tests', () => {
    let tempFilePath;

    beforeAll(() => {
        const tmpFile = tmp.fileSync();
        tempFilePath = tmpFile.name;
    });

    afterAll(() => {
        tmp.setGracefulCleanup();
    });

    test("snippet edits", () => {
        readAndRun('./test/testHtmls/input1.html', tempFilePath, {flatten: true, replaceId: true});

        const expectedHtml = readFile('./test/testHtmls/expectedOutput1.html');
        const outputHtml = readFile(tempFilePath);
        
        expect(reformatHtml(outputHtml)).toHaveLength(reformatHtml(expectedHtml).length);

        const ids = extractId(outputHtml);

        expect(ids).toHaveLength(6);

        const uniqueIds = Array.from(new Set(...[ids]));

        expect(uniqueIds).toHaveLength(6);
    });
    
    test("full html edits", () => {
        readAndRun('./test/testHtmls/loremInput.html', tempFilePath, {flatten: true, replaceId: true});
        const outputHtml = readFile(tempFilePath);

        expect(outputHtml).toMatch(new RegExp(`^<!DOCTYPE html>?`))

        const ids = extractId(outputHtml);

        expect(ids).toHaveLength(36);

        const uniqueIds = Array.from(new Set(...[ids]));

        expect(uniqueIds).toHaveLength(36);
    });
});