import { extractId } from '../src/extractor';
 
describe('test id replacer', () => {
    const div1 = `
    <div style="text-align: center;">&nbsp;</div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facaddd11111"></div>
    <div>&nbsp;</div>
      `;

    const res1 = ['fc76a7bd-0640-4690-a57b-facadddc3e4c', 'fc76a7bd-0640-4690-a57b-facaddd11111']

    test('extracts both ids from html', () => {
        expect(extractId(div1)).toEqual(res1);
    })

});