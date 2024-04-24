import { createZip } from "./emailZip.js";

const company = process.argv[2] ?? 'force';

const dest = process.argv[3] ?? `../swapify-frontend/.env/${company}/email/final/${company}.zip`;

const imagePath = `../swapify-frontend/.env/${company}/email/final/images`;
const htmlPath = `../swapify-frontend/.env/${company}/email/final/template.html`;

createZip(htmlPath, imagePath, dest);