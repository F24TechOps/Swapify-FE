import { extractBackgrounds, extractButton, extractFonts, extractImage } from "./extractor.js";

const buttonKeys = [
    'background',
    'background-color',
    'border-radius',
    'color',
    'display',
    'font-family',
    'font-size',
    'font-style',
    'font-weight',
    'line-height',
    'text-align',
    'text-decoration',
    'text-transform'
];

const mapFeature = (featureMapper, feature, idx, type) => {
    featureMapper[`${type}${idx}`] = {};
    featureMapper[`${type}${idx}`][`old${type}`] = feature;
    featureMapper[`${type}${idx}`][`new${type}`] = null;

    return featureMapper;
}

const mapButton = (buttonMapper, button, idx, type) => {

    const oldButton = JSON.parse(button);

    const newButton = buttonKeys.reduce((button, key) => {
        button[key] = null;
        return button;
    }, {});

    if (type === 'microsite') {
        buttonMapper[`Button${idx}`] = {oldButton, newButton};
    }
    else {
        const { innerButton , outerButton } = oldButton;

        buttonMapper[`Button${idx}`] = { innerButton , outerButton }
        buttonMapper[`Button${idx}`].newInnerButton = newButton;
        buttonMapper[`Button${idx}`].newOuterButton = newButton;
    }

    return buttonMapper;
}

export async function createMapping(html, type) {
    const backgrounds = extractBackgrounds(html, type);
    const fonts = extractFonts(html, type);
    const imageElements = extractImage(html);
    const buttonElements = extractButton(html, type);

    const backgroundColors = backgrounds.reduce((mapper, background, idx) => mapFeature(mapper, background, idx, 'Background'), {});
    const fontFamily = fonts.reduce((mapper, font, idx) => mapFeature(mapper, font, idx, 'FontFamily'), {});;
    const images = imageElements.reduce((mapper, background, idx) => mapFeature(mapper, background, idx, 'Images'), {});;
    const buttons = buttonElements.reduce((buttonMapper, button, idx) => mapButton(buttonMapper, button, idx, type), {});
    const allButtons = buttonKeys.reduce((mapper, key) => {
        mapper[key] = null;
        return mapper;
    }, {});

    return {backgroundColors, fontFamily, images, buttons, allButtons};
}
