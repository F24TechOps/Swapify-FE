import {changeBackground} from '../src/background';
 
describe('test background change', () => {

    const div1 = `
      <div style="background-color: #FFFFFF;">
        Hello
      </div>`
      ;

    const res1 = `
      <div style="background-color: #FF0000;">
        Hello
      </div>`
      ;

    test("changes background from white to red", () => {
        expect(changeBackground(div1, "#FFFFFF", "#FF0000")).toBe(res1);
    });

    const div2 = `
      <div style="background-color: #000000;">
        Hello
      </div>
      <div style="background-color: #000000;">
        There
      </div>`
      ;

    const res2 = `
      <div style="background-color: #0000FF;">
        Hello
      </div>
      <div style="background-color: #0000FF;">
        There
      </div>`
      ;

    test("changes multiple backgrounds", () => {
        expect(changeBackground(div2, "#000000", "#0000FF")).toBe(res2);
    });

    const div3 = `
      <div style="background-color: #000000; color: #000000">
        Hello
      </div>
      `;

    const res3 = `
      <div style="background-color: #0000FF; color: #000000">
        Hello
      </div>
      `;

    test("changes background colour and not text colour", () => {
        expect(changeBackground(div3, "#000000", "#0000FF")).toBe(res3);
    });
});