import { createMapping } from "./mapping.js";
import { readFile, writeFile } from "./runAll.js";

export const generateMapping = async (type, company) => {
    console.log(type, company, 'createMap');
  if (!['email', 'microsite'].includes(type)) {
    throw new Error("type must be either 'email' or 'microsite'");
  }

  const html = readFile(`./src/html/${type}/base1/template.html`);
  const mapping = await createMapping(html, type);
  writeFile(`./.env/${company}/${type}/json/mapping.json`, JSON.stringify(mapping, null, 2));
  return mapping;
};
