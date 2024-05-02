import { JSDOM } from "jsdom";

export function extractId(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const f24IdElements = document.querySelectorAll("[data-f24-id]");

  return Array.from(f24IdElements).map((element) =>
    element.getAttribute("data-f24-id")
  );
}

export const getBackgrounds = (document, type) =>
  type === "microsite"
    ? document.getElementsByTagName("div")
    : document.querySelectorAll(`[align="center"]:not(.mceNonEditable)`);

export const getText = (document) =>
  document.querySelectorAll("div, span, strong, p");

export const getBackgroundImg = (document) =>
  document.getElementsByClassName("row");

export const getImage = (document) => document.getElementsByTagName("img");

export const extractBackgrounds = (html, type) =>
  extractFeature(
    html,
    (element, dom) =>
      dom.window.getComputedStyle(element, null).backgroundColor,
    ["rgba(0, 0, 0, 0)", "inherit"],
    getBackgrounds,
    type
  );

export const extractFonts = (html, type) =>
  extractFeature(
    html,
    (element, dom) => dom.window.getComputedStyle(element, null).fontFamily,
    [""],
    getText,
    type
  );

export const extractFontSize = (html, type) =>
<<<<<<< HEAD
  extractFeature(html, (element) => element.style.fontSize, [], getText, type);

export const extractFontColour = (html, type) =>
  extractFeature(html, (element) => element.style.color, [], getText, type);
=======
  extractFeature(
    html,
    (element) => element.style.fontSize,
    [""],
    getText,
    type
  );

export const extractFontColour = (html, type) =>
  extractFeature(
    html,
    (element) => element.style.color,
    [""],
    getText,
    type
  );
>>>>>>> 405bc7418a34b81a74d66cdc5999e04b9760c383

export const extractBackgroundImg = (html) =>
  extractFeature(html, (element) => element.style.backgroundImage, [], getBackgroundImg);

export const extractImage = (html) =>
  extractFeature(html, (element) => element.src, [], getImage);

function extractFeature(html, getFeature, nonExistent, getElement, type) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const allElements = Array.from(getElement(document, type));

  const allBackgrounds = allElements.map((element) => getFeature(element, dom));

  return Array.from(new Set(...[allBackgrounds])).filter(
    (a) => !nonExistent.includes(a)
  );
}

export const getButtonInfo = (element) => {
  const styles = element
    .getAttribute("style")
    .split(";")
    .filter((str) => str.includes(":"))
    .sort();
  const styleObject = {};

  styles.forEach((style) => {
    const [key, value] = style
      .split(":")
      .map((prop) => prop.trim().replace("\n", ""));
    styleObject[key] = value.replace(/\s+/g, "");
  });

  return JSON.stringify(styleObject, null, 2);
};

export function extractButton(html, type) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  let allStyles;

  if (type === "microsite") {
    const allElements = Array.from(document.getElementsByClassName("btn"));

    allStyles = allElements.map(getButtonInfo);
  } else {
    const allButtonContainers = Array.from(
      document.querySelectorAll("td.mceNonEditable")
    );

    allStyles = allButtonContainers.map((container) => {
      const innerButton = container.querySelector("a");
      if (!innerButton) return;

      const outerButtonInfo = getButtonInfo(container);
      const innerButtonInfo = getButtonInfo(innerButton);

      const inner = JSON.parse(innerButtonInfo);
      const outer = JSON.parse(outerButtonInfo);

      return JSON.stringify(
        { innerButton: inner, outerButton: outer },
        null,
        2
      );
    });
  }

  return Array.from(new Set(...[allStyles]));
}
