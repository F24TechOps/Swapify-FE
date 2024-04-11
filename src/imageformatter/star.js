import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

// Hex color code to replace non-white pixels
const replaceColor = "#354795"; // Change this to your desired color

// Process images from 'star-1.png' to 'star-5.png'
for (let i = 1; i <= 5; i++) {
  const inputFile = `./.env/force24/images/star-${i}.png`;
  const outputFile = inputFile;

  // Load image
  loadImage(inputFile).then(img => {
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0);

    // Get the image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Loop through each pixel
    for (let j = 0; j < data.length; j += 4) {
      // Check if the pixel is not white
      if (data[j] !== 255 || data[j + 1] !== 255 || data[j + 2] !== 255) {
        // Replace non-white pixels with the specified color
        data[j] = parseInt(replaceColor.substring(1, 3), 16); // Red
        data[j + 1] = parseInt(replaceColor.substring(3, 5), 16); // Green
        data[j + 2] = parseInt(replaceColor.substring(5, 7), 16); // Blue
      }
    }

    // Put the modified image data back onto the canvas
    ctx.putImageData(imageData, 0, 0);

    // Save the canvas as a PNG file
    const out = fs.createWriteStream(outputFile);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => {
      console.log(`${inputFile} converted and saved as ${outputFile}`);
    });
  }).catch(err => {
    console.error('Error processing image:', err);
  });
}
