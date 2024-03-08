import { JSDOM } from 'jsdom';
import { isFullHtml } from "./checkHtml.js";
import { normalizeUrl } from './normalizeURL.js';

export function updateHtmlContent(html, allUpdatesObj) {
  const full = isFullHtml(html);
  const dom = new JSDOM(html);
  const document = dom.window.document;

  //   Update colors
  function changeBackgroundColour(allUpdatesObj) {
    const allElements = document.querySelectorAll(`[align="center"]`);
    // allElements.forEach((element) => console.log(element))
    // console.log(allElements.length);

    for (const colorType in allUpdatesObj.backgroundColors) {
      for (let i = 0; i < allElements.length; i++) {
        let element = allElements[i];

        if (element.getAttribute("data-background-updated") === "true") {
          continue;
        }

        if (element.hasAttribute("data-f24-editor-cta-button-td")) {
          continue;
        }

        if (
          dom.window.getComputedStyle(element, null).backgroundColor ===
          allUpdatesObj.backgroundColors[colorType].oldBackground
        ) {
          element.style.backgroundColor =
            allUpdatesObj.backgroundColors[colorType].newBackground;
          element.setAttribute("data-background-updated", "true");
        }
      }
    }
  }

  changeBackgroundColour(allUpdatesObj);

  // // Update fonts
  function changeFontFamily(allUpdatesObj) {
    const allElements = document.querySelectorAll("div.width90pc");

    for (const fontType in allUpdatesObj.fontFamily) {
      for (let i = 0; i < allElements.length; i++) {
        let element = allElements[i];

        if (
          dom.window
            .getComputedStyle(element, null)
            .fontFamily.toLowerCase().includes(
              allUpdatesObj.fontFamily[fontType].oldFontFamily.toLowerCase()
            )
        ) {
          element.style.fontFamily =
            allUpdatesObj.fontFamily[fontType].newFontFamily;
        }
      }
    }
  }

  changeFontFamily(allUpdatesObj);

// Update Images
  function changeImgSrc(allUpdatesObj) {
    const allElements = document.getElementsByTagName("img");


    for (const imgType in allUpdatesObj.images) {
      for (let i = 0; i < allElements.length; i++) {
        let element = allElements[i];

        let normalURL = normalizeUrl(element.src)
        let oldURL = normalizeUrl(allUpdatesObj.images[imgType].oldImageSrc)

        if (normalURL === oldURL) {
          element.src = allUpdatesObj.images[imgType].newImageSrc;
          if (element.closest('[data-f24-layout-column-reorder]')) {
            element.closest('[data-f24-layout-column-reorder]').style.display = 'flex';
            element.closest('[data-f24-layout-column-reorder]').style.alignItems = 'center'
          }
        }
      }
    }
  }

  changeImgSrc(allUpdatesObj);

  // Update All Buttons
  // function updateAllButtons(allUpdatesObj) {
  //   const allElements = document.querySelectorAll('.btn')
  //   allElements.forEach((element) => {
  //     element.style = allUpdatesObj.allButtons
  //   })
  // }

  // updateAllButtons(allUpdatesObj)

  return full ? dom.serialize() : document.body.innerHTML;
}
