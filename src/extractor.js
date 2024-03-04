import { JSDOM } from 'jsdom';

export function extractId(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const f24IdElements = document.querySelectorAll('[data-f24-id]');

    return Array.from(f24IdElements).map((element) => element.getAttribute('data-f24-id'));
}