import {flatten} from '../src/flattener';
import { reformatHtml } from './helpers/testfunctions';
 
describe.only('test div flattener', () => {
    const div1 = `
      <div style="background-color: #FFFFFF;">
        Hello
      </div>`
      ;

    const res1 = `
      <div style="background-color: #FFFFFF;">
        Hello
      </div>`
      ;

    test("changes background from white to red", () => {
        expect(reformatHtml(flatten(div1))).toBe(reformatHtml(res1));
    });

    const div2 = `
      <div>
      <div style="background-color: #FFFFFF;">
        Hello
      </div>
      </div>`
      ;

    const res2 = `
      <div style="background-color: #FFFFFF;">
        Hello
      </div>`
      ;

    test("changes background from white to red", () => {
        expect(reformatHtml(flatten(div2))).toBe(reformatHtml(res2));
    });
});
