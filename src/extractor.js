import { JSDOM } from 'jsdom';

export function extractId(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const f24IdElements = document.querySelectorAll('[data-f24-id]');

    return Array.from(f24IdElements).map((element) => element.getAttribute('data-f24-id'));
}

export const extractBackgrounds = (html) => extractFeature(html, (element, dom) => dom.window.getComputedStyle(element, null).backgroundColor, ['rgba(0, 0, 0, 0)', 'inherit'], "div");

export const extractFonts = (html) => extractFeature(html, (element, dom) => dom.window.getComputedStyle(element, null).fontFamily, [], "div");

export const extractImage = (html) => extractFeature(html, (element) => element.src, [], "img");

function extractFeature(html, getFeature, nonExistent, tagName) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const allElements = Array.from(document.getElementsByTagName(tagName));

    const allBackgrounds = allElements.map((element) => getFeature(element, dom))
    
    return Array.from(new Set(...[allBackgrounds])).filter(a => !nonExistent.includes(a));
}

export const getButtonInfo = (element) => {
    const styles = element.getAttribute('style').split(';').filter(str => str.includes(':')).sort();
    const styleObject = {};

    styles.forEach((style) => {
        const [key, value] = style.split(':').map(prop => prop.trim());
        styleObject[key] = value;
    });

    return JSON.stringify(styleObject, null, 2);
};

export function extractButton(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const allElements = Array.from(document.getElementsByClassName("btn"));

    const allStyles = allElements.map(getButtonInfo);

    return Array.from(new Set(...[allStyles]));
}