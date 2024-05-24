import express from "express";
import path from "path";
import { generateMapping } from "./backend/createMap.js";
import { exec } from "child_process";
import fs from "fs";
import { createZip } from "./backend/emailZip.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "frontend-build")));

//tested
app.get("/api/:type/template", (req, res) => {
  const { type } = req.params;
  const filePath = path.join(
    __dirname,
    `../src/html/${type}/base1/template.html`
  );

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send(`${type} isn't an accepted template type`);
    }
  });
});

//tested
app.get("/api/:type/:company/final-template", (req, res) => {
  const { type, company } = req.params;
  const filePath = path.join(
    __dirname,
    `../.env/${company}/${type}/final/template.html`
  );

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
});

//tested
app.get("/api/mapping/:type/:company", (req, res) => {
  const { type, company } = req.params;
  const filePath = path.join(
    __dirname,
    `../.env/${company}/${type}/json/mapping.json`
  );

  if (path.extname(filePath) !== ".json") {
    res.status(400).send("Not a JSON file");
    return;
  }

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
});

//tested
app.post("/api/create-download", (req, res) => {
  const { type, company } = req.body;

  if (type === "email") {
    const htmlPath = path.join(
      __dirname,
      `../.env/${company}/email/final/template.html`
    );
    const imagePath = path.join(
      __dirname,
      `../.env/${company}/email/final/images`
    );
    const zipDest = path.join(
      __dirname,
      `../.env/${company}/email/final/${company}.zip`
    );

    createZip(htmlPath, imagePath, zipDest)
      .then(() => {
        res.download(zipDest, `${company}.zip`, (err) => {
          if (err) {
            // console.error("Error sending zip file:", err);
            res.status(400).send("Error sending zip file");
          }
        });
      })
      .catch((error) => {
        // console.error(`Error Downloading Zip`, error);
        res.status(400).send(`Error creating zip file`);
      });
  } else if (type === "microsite") {
    const htmlPath = path.join(
      __dirname,
      `../.env/${company}/microsite/final/template.html`
    );
    try {
      const copyText = fs.readFileSync(htmlPath, "utf8");
      res.status(200).send(copyText);
    } catch (error) {
      res.status(400).send(`Error reading HTML file: ${error}`);
    }
  } else {
    res.status(404).send("Invalid type specified");
  }
});

//tested
app.post("/api/create-mapping/:type/:company", async (req, res) => {
  const { type, company } = req.params;
  const mapping = await generateMapping(type, company);
  const filePath = path.join(
    __dirname,
    `../.env/${company}/${type}/json/mapping.json`
  );

  if (!mapping) {
    res.status(400).send("HTML content is required");
  }

  fs.writeFileSync(filePath, JSON.stringify(mapping, null, 2), "utf8");
  res.status(201).send("Mapping created");
});

//tested
app.post("/api/swap", (req, res) => {
  const { type, company } = req.body;

  const command = `node ./src/backend/swap.js ${type} ${company}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      // console.error(`Error executing swap script: ${error} ${stderr}`);
      return res
        .status(400)
        .send(`Error executing swap script: ${error.message}`);
    }
    // console.log(`Swap script output: ${stdout}`);
    res.status(200).send("Swap script executed successfully");
  });
});

app.patch("/api/update-mapping/:type/:company", async (req, res) => {
  const { type, company } = req.params;
  const mappingData = req.body;

  const filePath = path.join(
    __dirname,
    `../.env/${company}/${type}/json/mapping.json`
  );

  if (!filePath) {
    console.log('true');
  }

  try {
    const fileData = fs.readFileSync(filePath, "utf8");
    const existingMappingData = JSON.parse(fileData);

    const updatedMappingData = {
      ...existingMappingData,
      ...mappingData,
    };

    fs.writeFileSync(
      filePath,
      JSON.stringify(updatedMappingData, null, 2),
      "utf8"
    );

    res.status(200).send("Mapping updated successfully");
  } catch (error) {
    // console.error("Error updating mapping:", error);
    res.status(500).send("Error updating mapping");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend-build", "index.html"));
});

const PORT = process.env.NODE_ENV === "test" ? 5501 : process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
