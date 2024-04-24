import fs from 'fs';
import JSZip from 'jszip';
import path from 'path';

export const createZip = (htmlPath, imagePath, dest) => {
    const zip = new JSZip();

    const html = fs.readFileSync(htmlPath);
    zip.file('template.html', html);

    const images = fs.readdirSync(imagePath);

    images.forEach((image) => {
        const filePath = path.join(imagePath, image);
        const content = fs.readFileSync(filePath);
        zip.file(`images/${image}`, content);
    });

    zip.generateAsync({ type: 'nodebuffer' }).then((content) => {
        fs.writeFileSync(dest, content);
    }).catch((err) => {
        console.error('Error creating zip file:', err);
    });
} 