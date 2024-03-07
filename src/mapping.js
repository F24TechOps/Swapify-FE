import { askQuestion } from "./ui/console.js";
import { extractBackgrounds, extractButton, extractFonts, extractImage } from "./extractor.js";

const mapFeature = async (feature, idx, featureMapper, type) => {
    const newFeat = await askQuestion(`What do you want to replace ${feature} with?`, feature, type === 'Background');
    if (newFeat) {
        featureMapper[`${type}${idx}`] = {};
        featureMapper[`${type}${idx}`][`old${type}`] = feature;
        featureMapper[`${type}${idx}`][`new${type}`] = newFeat;
    }
}

const mapButton = async (button, idx, buttonMapper) => {
    console.log('Button Information:')
    console.log(button);

    const colouredVariables = ['background', 'border-color', 'color'];

    const edit = await askQuestion(`Do you want to edit this button? (Press Y or y)`);

    if (edit.toLowerCase() === "y") {
        const oldButton = JSON.parse(button);
        const oldKeys = Object.keys(oldButton)
        const newButton = {};

        for (let i = 0; i < oldKeys.length; i++) {
            const key = oldKeys[i];
            const newFeat = await askQuestion(`What do you want to replace the ${key} with? (currently ${oldButton[key]})`, oldButton[key], colouredVariables.includes(key));
            if (newFeat)
                newButton[key] = newFeat;
        }

        buttonMapper[`Button${idx}`] = {};
        buttonMapper[`Button${idx}`][`oldButton`] = oldButton;
        buttonMapper[`Button${idx}`][`newButton`] = newButton;
    }
}

export async function createMapping(html) {
    const backgrounds = extractBackgrounds(html);
    const fonts = extractFonts(html);
    const images = extractImage(html);
    const buttons = extractButton(html);

    const backgroundMapper = {};
    const fontMapper = {};
    const imageMapper = {};
    const buttonMapper = {};

    for (let idx = 0; idx < backgrounds.length; idx++) {
        await mapFeature(backgrounds[idx], idx, backgroundMapper, 'Background');
    }

    for (let idx = 0; idx < fonts.length; idx++) {
        await mapFeature(fonts[idx], idx, fontMapper, 'FontFamily');
    }

    for (let idx = 0; idx < images.length; idx++) {
        await mapFeature(images[idx], idx, imageMapper, 'ImageSrc');
    }

    for (let idx = 0; idx < buttons.length; idx++) {
        await mapButton(buttons[idx], idx, buttonMapper);
    }

    return {backgroundColors: backgroundMapper, fontFamily: fontMapper, images: imageMapper, buttons: buttonMapper};
}
