import { cropCircle } from './createCircle.js';

const company = process.argv[2] ?? 'force';
const imageName = process.argv[3] ?? 'portrait';

const inputFile = `./.env/${company}/email/final/images/${imageName}.png`;
const outputFile = `./.env/${company}/email/final/images/circle.png`;

cropCircle(inputFile, outputFile);