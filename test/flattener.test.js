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

    test("removes an multiple nested divs", () => {
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

    test("removes multiple snippets of nested divs", () => {
        expect(reformatHtml(flatten(div4))).toBe(reformatHtml(res4));
    });

    const div5 = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Unnecessary Nested Divs Example</title>
        </head>
        <body>

        <div>
            <div>
                <div>
                    <p>Hello</p>
                </div>
            </div>
        </div>

        </body>
        </html>`
      ;

    const res5 = `
        <!DOCTYPE html><html lang="en"><head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Unnecessary Nested Divs Example</title>
        </head>
        <body>

        <div>
            <p>Hello</p>
        </div>

        </body></html>`
    ;


    test("removes nested divs for whole document", () => {
        expect(reformatHtml(flatten(div5))).toBe(reformatHtml(res5));
    });

    const div6 = `
        <div>
            <div>
            <p>Hello</p>
            <div><span>World</span></div>
            </div>
        </div>
    `;

    const res6 = `
        <div>
            <p>Hello</p>
            <div><span>World</span></div>
        </div>
    `;

    test("removes nested divs for multiple elements in div", () => {
        expect(reformatHtml(flatten(div6))).toBe(reformatHtml(res6));
    });

    const div7 = `
        <div>
            <div>
            <div>
                <p>Hello</p>
            </div>
            <div>
                <span>World</span>
            </div>
            </div>
        </div>
        `;

    const res7 = `
        <div>
        <div>
            <p>Hello</p>
            </div>
            <div>
            <span>World</span>
            </div>
        </div>
        `;

    test("removes nested divs for multiple elements in div", () => {
        expect(reformatHtml(flatten(div7))).toBe(reformatHtml(res7));
    });
});
