import {flatten} from '../src/flattener';
import { reformatHtml } from './helpers/testfunctions';
 
describe('test div flattener', () => {
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

    test("makes no changes if all divs are useful", () => {
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

    test("removes an outer layer div element", () => {
        expect(reformatHtml(flatten(div2))).toBe(reformatHtml(res2));
    });

    const div3 = `
    <div>
    <div>
    <div style="background-color: #FFFFFF;">
      Hello
    </div>
    </div>
    </div>`
      ;

    const res3 = `
      <div style="background-color: #FFFFFF;">
        Hello
      </div>`
      ;

    test("removes an inner layer div element", () => {
        expect(reformatHtml(flatten(div3))).toBe(reformatHtml(res3));
    });

    const div4 = `
    <div>
    <div>
    <div style="background-color: #FFFFFF;">
      Hello
    </div>
    </div>
    </div>
    <div>
    <div>
    <div style="background-color: #FFFFFF;">
      Hello
    </div>
    </div>
    </div>`
      ;

    const res4 = `
    <div style="background-color: #FFFFFF;">
        Hello
    </div>
      <div style="background-color: #FFFFFF;">
        Hello
      </div>`
      ;

    test("removes an inner layer div element", () => {
        expect(reformatHtml(flatten(div4))).toBe(reformatHtml(res4));
    });
});
