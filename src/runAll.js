import { flatten } from "./flattener";
import { replaceId } from "./replacer";

export function runAll (html, selections) {
    if (selections.flatten)
        html = flatten(html);

    if (selections.replaceId)
        html = replaceId(html);

    return html;
}