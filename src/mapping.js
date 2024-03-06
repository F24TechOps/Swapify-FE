import { askQuestion } from "./ui/console.js";
import { extractBackgrounds, extractFonts, extractImage } from "./extractor.js";

const mapFeature = async (feature, idx, featureMapper, type) => {
    const newFeat = await askQuestion(`What do you want to replace ${feature} with?`, feature, type === 'Background');
    if (newFeat) {
        featureMapper[`${type}${idx}`] = {};
        featureMapper[`${type}${idx}`][`old${type}`] = feature;
        featureMapper[`${type}${idx}`][`new${type}`] = newFeat;
    }
}

export async function createMapping(html) {
    const backgrounds = extractBackgrounds(html);
    const fonts = extractFonts(html);
    const images = extractImage(html);

    const backgroundMapper = {};
    const fontMapper = {};
    const imageMapper = {};

    for (let idx = 0; idx < backgrounds.length; idx++) {
        await mapFeature(backgrounds[idx], idx, backgroundMapper, 'Background');
    }

    for (let idx = 0; idx < fonts.length; idx++) {
        await mapFeature(fonts[idx], idx, fontMapper, 'FontFamily');
    }

    for (let idx = 0; idx < images.length; idx++) {
        await mapFeature(images[idx], idx, imageMapper, 'ImageSrc');
    }

    return {backgroundColors: backgroundMapper, fontFamily: fontMapper, images: imageMapper};
}
