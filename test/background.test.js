const { updateHtmlContent } = require("../src/background.js");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe("test snippet change", () => {
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

  test("changes background from blue to red", () => {
    const updatedHtmlContent = updateHtmlContent(`src/microsite.html`, updates, `src/${Date.now()}-updated-microsite.html`);
    const dom = new JSDOM(updatedHtmlContent);
    const document = dom.window.document;
    const updatedElement = document.querySelector(".clearfix");

    expect(updatedElement.style.backgroundColor).toBe("rgb(224, 70, 59)");
  });
  test("changes font from open sans to fantasy", () => {
    const updatedHtmlContent = updateHtmlContent(`src/microsite.html`, updates, `src/${Date.now()}-updated-microsite`);
    const dom = new JSDOM(updatedHtmlContent);
    const document = dom.window.document;
    const updatedElement = document.getElementsByTagName("p");

    expect(updatedElement.length).toBeGreaterThan(0);
    if (updatedElement.length > 0) {
      const computedStyle = dom.window.getComputedStyle(updatedElement[0]);
      expect(computedStyle.fontFamily).toContain("Fantasy");
    }
  });
  test("changes logo src", () => {
    const updatedHtmlContent = updateHtmlContent(`src/microsite.html`, updates, `src/${Date.now()}-updated-microsite`);
    const dom = new JSDOM(updatedHtmlContent);
    const document = dom.window.document;
    const updatedElement = document.querySelectorAll(".logo");

    expect(updatedElement.length).toBeGreaterThan(0);
    if (updatedElement.length > 0) {
      const elementSrc = updatedElement[0].getAttribute("src");
      expect(elementSrc).toBe(
        "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
      );
    }
  });
});
