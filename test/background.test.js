import { updateHtmlContent } from "../src/background.js";
import { JSDOM } from "jsdom";

describe.skip("test snippet change", () => {
  const updates = {
    colors: {
      background: ".clearfix",
      color: "rgb(224, 70, 59)",
    },
    fonts: {
      selector: "p",
      fontFamily: "Fantasy, sans-serif",
    },
    logos: {
      selector: ".logo",
      newLogoUrl:
        "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png",
    },
  };

  test.skip("changes updates in origin file to new file", () => {
    const updatedHtmlContent = updateHtmlContent(
      `src/microsite.html`,
      updates,
      `src/${Date.now()}-updated-microsite.html`
    );
    const dom = new JSDOM(updatedHtmlContent);
    const document = dom.window.document;
    const updatedElement = document.querySelector(".clearfix");

    expect(updatedElement.style.backgroundColor).toBe("rgb(224, 70, 59)");
    expect(updatedElements.length).toBeGreaterThan(0);
    if (updatedElements.length > 0) {
      const computedStyle = dom.window.getComputedStyle(updatedElements[0]);
      expect(computedStyle.fontFamily).toContain("Fantasy");
    }
  });
});
