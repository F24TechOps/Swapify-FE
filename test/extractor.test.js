import { extractId } from '../src/extractor';
 
describe('test id extractor', () => {
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

    const div2 = `
    <div style="text-align: center;">&nbsp;</div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div align="center"><a alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facaddd11111">Hello</a></div>
    <div>&nbsp;</div>
      `;

    test('extracts both ids from html with different types', () => {
      expect(extractId(div2)).toEqual(res1);
    });

    const div3 = `
    <div style="text-align: center;">&nbsp;</div>
    <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div align="center"><a alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facaddd11111">Hello</a></div>
    <div align="center"><a alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file">Hello</a></div>
    <div>&nbsp;</div>
      `;

    test('extracts both ids from html with empty types', () => {
      expect(extractId(div3)).toEqual(res1);
    });
});