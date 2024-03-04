import { JSDOM } from 'jsdom';

export function extractId(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const f24IdElements = document.querySelectorAll('[data-f24-id]');

    return Array.from(f24IdElements).map((element) => element.getAttribute('data-f24-id'));
}

export function extractBackgrounds(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const allElements = Array.from(document.getElementsByTagName("div"));

    const allBackgrounds = allElements.map((element) => {
        return dom.window.getComputedStyle(element, null).backgroundColor;
    })
    
    return Array.from(new Set(...[allBackgrounds.filter(colour => colour !== 'rgba(0, 0, 0, 0)')]));
}