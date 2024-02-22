import {flatten} from '../src/flattener';
 
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
        expect(flatten(div1)).toBe(res1);
    });
});
