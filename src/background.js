
export function changeBackground(html, oldColour, newColour) {
    return html.replace(new RegExp("background-color: " + oldColour , 'g'), "background-color: " + newColour);
}