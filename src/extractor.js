import { JSDOM } from 'jsdom';

export function extractId(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const f24IdElements = document.querySelectorAll('[data-f24-id]');

    return Array.from(f24IdElements).map((element) => element.getAttribute('data-f24-id'));
}

export const extractBackgrounds = (html) => extractFeature(html, (element, dom) => dom.window.getComputedStyle(element, null).backgroundColor, ['rgba(0, 0, 0, 0)', 'inherit'], "div");

export const extractFonts = (html) => extractFeature(html, (element, dom) => dom.window.getComputedStyle(element, null).fontFamily, [''], "div");

export const extractImage = (html) => extractFeature(html, (element) => element.src, [null], "img");

function extractFeature(html, getFeature, nonExistent, tagName) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const allElements = Array.from(document.getElementsByTagName(tagName));

    const allBackgrounds = allElements.map((element) => getFeature(element, dom))
    
    return Array.from(new Set(...[allBackgrounds])).filter(a => !nonExistent.includes(a));
}