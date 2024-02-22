const { JSDOM } = require('jsdom');

export function flatten(html) {

    const dom = new JSDOM(html);
    const body = dom.window.document.body;

    const divElements = body.querySelectorAll('div');

    divElements.forEach((div) => {
        if (div.childElementCount === 1 && div.children[0].tagName === 'DIV') {
            const child = div.children[0].cloneNode(true);
            div.parentNode.replaceChild(child, div);
        }
    });

    return body.innerHTML;
}