import { replaceId } from '../src/replacer';
import { reformatHtml } from './helpers/testfunctions';
 
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

    // const div2 = `
    // <div style="text-align: center;">&nbsp;</div>
    // <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    // <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facaddd11111"></div>
    // <div>&nbsp;</div>
    //   `;

    // const res2 = `
    // <div style="text-align: center;">&nbsp;</div>
    // <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    // <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facaddd11111"></div>
    // <div>&nbsp;</div>
    //   `;
});
