import { JSDOM } from "jsdom";
import { isFullHtml } from "./checkHtml.js";
import { normalizeUrl } from "./normalizeURL.js";
import { getBackgrounds, getButtonInfo, getFonts, getImage } from "./extractor.js";

export function updateHtmlContent(html, allUpdatesObj, type = 'email') {
  const full = isFullHtml(html);
  const dom = new JSDOM(html);
  const document = dom.window.document;

  //   Update colors
  function changeBackgroundColour(allUpdatesObj) {
    const allElements = getBackgrounds(document, type);

    for (const colorType in allUpdatesObj.backgroundColors) {
      for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];

        if (element.getAttribute("data-background-updated") === "true") {
          continue;
        }

        if (element.hasAttribute("data-f24-editor-cta-button-td")) {
          continue;
        }

        const { newBackground } = allUpdatesObj.backgroundColors[colorType];

        if (newBackground === null)
          continue;

        if (
          dom.window.getComputedStyle(element, null).backgroundColor ===
          allUpdatesObj.backgroundColors[colorType].oldBackground
        ) {
          element.style.backgroundColor = newBackground;
          element.setAttribute("data-background-updated", "true");
        }
      }
    }
  }

  changeBackgroundColour(allUpdatesObj);

  // Update fonts
  function changeFont(allUpdatesObj) {
    const allElements = getFonts(document, type);

    for (const fontType in allUpdatesObj.fontFamily) {
      for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        const { newFontFamily } = allUpdatesObj.fontFamily[fontType];

        if (newFontFamily === null)
          continue;

        if (
          dom.window
            .getComputedStyle(element, null)
            .fontFamily.toLowerCase()
            .includes(
              allUpdatesObj.fontFamily[fontType].oldFontFamily.toLowerCase()
            )
        ) {
          element.style.fontFamily = newFontFamily;
        }
      }
    }

    const allText = getText(document);

    for (const fontType in allUpdatesObj.fontSize) {
      for (let i = 0; i < allText.length; i++) {
        const element = allText[i];
        const  { newFontSize } = allUpdatesObj.fontSize[fontType];

        if (newFontSize === null)
          continue;

        if (
          dom.window.getComputedStyle(element, null).fontSize ===
          allUpdatesObj.fontSize[fontType].oldFontSize
        ) {
          element.style.fontSize = newFontSize;
        }
      }
    }

    for (const fontType in allUpdatesObj.fontColor) {
      for (let i = 0; i < allText.length; i++) {
        const element = allText[i];
        const { newFontColor } = allUpdatesObj.fontSize[fontType];

        if (newFontColor === null)
          continue;

        if (
          dom.window.getComputedStyle(element, null).color ===
          allUpdatesObj.fontColor[fontType].oldFontColor
        ) {
          element.style.color = newFontColor;
        }
      }
    }
  }

  changeFont(allUpdatesObj);

  // Update Images
  function changeImgSrc(allUpdatesObj) {
    const allElements = getImage(document, type);

    for (const imgType in allUpdatesObj.images) {
      for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];

        const normalURL = normalizeUrl(element.src);
        const oldURL = normalizeUrl(allUpdatesObj.images[imgType].oldImageSrc);

        const { newImageSrc } = allUpdatesObj.images[imgType];

        if (newImageSrc === null)
          continue;

        if (normalURL === oldURL) {
          element.src = newImageSrc;
          if (element.closest("[data-f24-layout-column-reorder]") && type === 'email') {
            element.closest("[data-f24-layout-column-reorder]").style.display =
              "flex";
            element.closest(
              "[data-f24-layout-column-reorder]"
            ).style.alignItems = "center";
          }
        }
      }
    }
  }

  changeImgSrc(allUpdatesObj);

  // Update All Buttons
  function changeButtonEmail(allUpdatesObj) {
    const allButtonContainers = document.querySelectorAll("td.mceNonEditable");

    allButtonContainers.forEach((container) => {
      const innerButton = container.querySelector("a");
      if (!innerButton) return;

      const outerButtonInfo = getButtonInfo(container);
      const innerButtonInfo = getButtonInfo(innerButton);

      for (const buttonType in allUpdatesObj.buttons) {
        const buttonData = allUpdatesObj.buttons[buttonType];
        const outerMatch =
          outerButtonInfo === JSON.stringify(buttonData.outerButton, null, 2);
        const innerMatch =
          innerButtonInfo === JSON.stringify(buttonData.innerButton, null, 2);

        if (outerMatch && innerMatch) {
          Object.entries(buttonData.newOuterButton).forEach(
            ([attribute, value]) => {
              if (value !== null)
                container.style[attribute] = value;
            }
          );
          Object.entries(buttonData.newInnerButton).forEach(
            ([attribute, value]) => {
              if (value !== null)
                innerButton.style[attribute] = value;
            }
          );
        }

        if (allUpdatesObj.allButtons) {
          for (const attribute in allUpdatesObj.allButtons.innerButton) {
            const newVal = allUpdatesObj.allButtons.innerButton[attribute]
            if (newVal !== null) 
              innerButton.style[attribute] = newVal;
          }

          for (const attribute in allUpdatesObj.allButtons.outerButton) {
            const newVal = allUpdatesObj.allButtons.outerButton[attribute]
            if (newVal !== null)
              container.style[attribute] = newVal;
          }
        }
      }
    });
  }

  function changeButtonMicrosite(allUpdatesObj) {
    const allButtons = document.getElementsByClassName("btn");

    for (const buttonType in allUpdatesObj.buttons) {
      for (let i = 0; i < allButtons.length; i++) {
        const element = allButtons[i];

        const info = getButtonInfo(element);

        if (info === JSON.stringify(allUpdatesObj.buttons[buttonType].oldButton, null, 2)) {
          for (const attribute in allUpdatesObj.buttons[buttonType].newButton) {
            const newVal = allUpdatesObj.buttons[buttonType].newButton[attribute];

            if (newVal === null)
              continue

            element.style[attribute] = newVal;
          }
        }
      }
    }

    if (allUpdatesObj.allButtons) {
      for (let i = 0; i < allButtons.length; i++) {
        const element = allButtons[i];
        for (const attribute in allUpdatesObj.allButtons) {
          const newVal = allUpdatesObj.allButtons[attribute]
          if (newVal !== null)
            element.style[attribute] = newVal;
        }
      }
    }
  }

  if (type === 'microsite')
    changeButtonMicrosite(allUpdatesObj);
  else
    changeButtonEmail(allUpdatesObj);

  return full ? dom.serialize() : document.body.innerHTML;
}
