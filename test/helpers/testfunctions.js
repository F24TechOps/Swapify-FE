const { JSDOM } = require('jsdom');

export function reformatHtml(html) {
    const dom = new JSDOM(html);
    const body = dom.window.document.body;
    return body.innerHTML.trim().replace(/\s+/g, ' ');
};