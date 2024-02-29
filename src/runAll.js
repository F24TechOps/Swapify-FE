import { flatten } from "./flattener";

export function runAll (html, selections) {
    if (selections.flatten)
        html = flatten(html);

    return html;
}