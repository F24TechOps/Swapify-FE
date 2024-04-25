import { extractId } from '../back-end/extractor.js';
import { replaceId } from '../back-end/replacer.js';
import { reformatHtml } from './helpers/testfunctions.js';
 
describe('test id replacer', () => {
    const div1 = `
    <div style="text-align: center;">&nbsp;</div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facaddd11111"></div>
    <div>&nbsp;</div>
      `;

    const res1 = `
    <div style="text-align: center;">&nbsp;</div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facaddd11111"></div>
    <div>&nbsp;</div>
      `;

    test("keeps ids if different", () => {
        expect(reformatHtml(replaceId(div1))).toBe(reformatHtml(res1));
    });

    const div2 = `
    <div style="text-align: center;">&nbsp;</div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div>&nbsp;</div>
      `;

    const res2_1 = `
    <div style="text-align: center;">&nbsp;</div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>`;

    const res2_2 = `<div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="`;
    
    const res2_3 = `"></div> <div>&nbsp;</div>`;

    test("replaces duplicate id", () => {
      const newDiv = reformatHtml(replaceId(div2));

      expect(newDiv.startsWith(reformatHtml(res2_1) + ' ' + res2_2)).toBe(true);
      expect(newDiv.endsWith(res2_3)).toBe(true);

      const ids = extractId(newDiv);

      expect(ids[0]).not.toBe(ids[1]);
    })

    const div3 = `
    <div style="text-align: center;">&nbsp;</div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e11"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e42"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e42"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div>&nbsp;</div>
      `;

    test('replaces multiple duplicate ids', () => {
      const newDiv = reformatHtml(replaceId(div3));
      const ids = extractId(newDiv);

      expect(ids).toHaveLength(6);

      const uniqueIds = Array.from(new Set(...[ids]));

      expect(uniqueIds).toHaveLength(6);
    });

    const div4 = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Duplicate F24 IDs</title>
        </head>
        <body>

        <div style="text-align: center;">&nbsp;</div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e11"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e42"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e42"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div>&nbsp;</div>

        </body>
        </html>`
      ;

    const res4 = `<!DOCTYPE html>`;

    test("replaces ids for whole document", () => {
      const newDiv = replaceId(div4);
      const ids = extractId(newDiv);

      expect(newDiv).toMatch(new RegExp(`^${res4}?`))

      expect(ids).toHaveLength(6);

      const uniqueIds = Array.from(new Set(...[ids]));

      expect(uniqueIds).toHaveLength(6);
    });
});
