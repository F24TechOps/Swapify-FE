import { extractId } from "./extractor";
const { JSDOM } = require('jsdom');
import { v4 as uuidv4 } from 'uuid';

export function replaceId(html) {
    const ids = new Set(...[extractId(html)]);
    return Array.from(ids).reduce(replaceIdsWithValues, html);
}

function replaceIdsWithValues (html, id) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const f24IdElements = Array.from(document.querySelectorAll('[data-f24-id]'))
        .filter((element) => element.getAttribute('data-f24-id') === id);

    if (f24IdElements.length <= 1)
        return html;

    f24IdElements.forEach((element, idx) => {
        if (idx)
            element.setAttribute('data-f24-id', uuidv4())
    });

    return dom.serialize();
}