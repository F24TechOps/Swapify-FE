const fs = require("fs");
const jsdom = require('jsdom')
const { JSDOM } = jsdom

// const filepath = `src/microsite.html`

function updateHtmlContent(filepath, updates) {
  const data = fs.readFileSync(filepath, "utf8");
  const dom = new JSDOM(data);
  const document = dom.window.document;
//   console.log(data.includes(updates.colors.background), '<-- STYLE')

  // Update colors
  if (updates.colors) {
    const elements = document.querySelectorAll(updates.colors.background);
    elements.forEach((element) => {
      element.style.backgroundColor = updates.colors.color;
    });
  }

  // Update fonts
  if (updates.fonts && data.includes(updates.fonts.selector)) {
    const elements = document.querySelectorAll(updates.fonts.selector);
    elements.forEach((element) => {
      element.style.fontFamily = updates.fonts.fontFamily;
    });
  }

  // Update logos
  if (updates.logos && data.includes(updates.logos.selector)) {
    const logoElement = document.querySelector(updates.logos.selector);
    if (logoElement) {
      logoElement.src = updates.logos.newLogoUrl;
    }
  }

  const updatedHtml = document.body.innerHTML;
  console.log(updatedHtml, '<-- UPDATED HTML')
  return updatedHtml;
}

module.exports = { updateHtmlContent }
