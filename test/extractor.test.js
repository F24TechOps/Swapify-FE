import { extractBackgrounds, extractId, extractFonts, extractImage } from '../src/extractor';
import { readFile } from '../src/runAll';
 
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

describe("test background extractor", () => {
    const div1 = `
      <div style="background-color:#FFFF00; text-align: center;">&nbsp;</div>
      <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
      <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facaddd11111"></div>
      <div>&nbsp;</div>
        `;

    test('extracts yellow background', () => {
      expect(extractBackgrounds(div1)).toEqual(['rgb(255, 255, 0)']);
    });

    const div2 = `
      <div style="background-color: yellow; text-align: center;">&nbsp;</div>
      <div style="background-color: #123456;" align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
      <div align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facaddd11111"></div>
      <div>&nbsp;</div>
        `;

    test('extracts 2 colours', () => {
      expect(extractBackgrounds(div2)).toEqual(['rgb(255, 255, 0)', 'rgb(18, 52, 86)']);
    });

    const div3 = `
      <div style="background-color: yellow; text-align: center;">&nbsp;</div>
      <div style="background-color: #123456;" align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
      <div style="background-color: rgb(255, 255, 0);" align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facaddd11111"></div>
      <div>&nbsp;</div>
        `;

    test('duplicates are removed', () => {
      expect(extractBackgrounds(div3)).toEqual(['rgb(255, 255, 0)', 'rgb(18, 52, 86)']);
    });
})

describe("test font extractor", () => {
  const div1 = `
    <div style="font-family: arial, helvetica, sans-serif; text-align: center;">&nbsp;</div>
    <div style="font-family:comic sans ms;" align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facadddc3e4c"></div>
    <div style="font-family:arial, helvetica, sans-serif;" align="center"><img src="" alt="Image" name="Image1" border="0" data-f24-editable="" data-f24-display-name="ImageName" data-f24-src-source-type="file" data-f24-id="fc76a7bd-0640-4690-a57b-facaddd11111"></div>
    <div>&nbsp;</div>
      `;

  test('extracts fonts', () => {
    expect(extractFonts(div1)).toEqual(['arial, helvetica, sans-serif', 'comic sans ms']);
  });
});

describe("test image extractor", () => {
  const div1 = readFile('./test/testHtmls/logos.html')

  test('extracts logos', () => {
    expect(extractImage(div1)).toEqual(['https://s3.eu-west-2.amazonaws.com/force24-assets/EmailTemplates/AccountTemplates/ab1ab55c/6dcc13a2/images/1708348658-9fe8c477.png?v=133541266545545835',
      'https://s3.eu-west-2.amazonaws.com/force24-assets/EmailTemplates/AccountTemplates/ab1ab55c/6dcc13a2/images/1708348617-133b1367.png?v=133541266545545835']);
  });
});