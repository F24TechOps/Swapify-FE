import {changeBackground} from '../src/background';
 
describe('test background change', () => {

    const div1 = "<div style=\"background-color: #FFFFFF;\">\n  Hello\n<\div>";

    test("background changes", () => {
        expect(changeBackground(div1, "#FFFFFF", "#FF0000")).toBe("<div style=\"background-color: #FF0000;\">\n  Hello\n<\div>");
    });
});