import request from "supertest";
import path from "path";
import fs from "fs";
import app from "../src/server";


const emailTemplatePath = path.join(
  __dirname,
  "..",
  "src",
  "html",
  "email",
  "base1",
  "template.html"
);
const micrositeTemplatePath = path.join(
  __dirname,
  "..",
  "src",
  "html",
  "microsite",
  "base1",
  "template.html"
);
const micrositeJson = path.join(
  __dirname,
  "..",
  ".env",
  "companyA",
  "microsite",
  "json",
  "mapping.json"
);
const emailJson = path.join(
  __dirname,
  "..",
  ".env",
  "companyA",
  "email",
  "json",
  "mapping.json"
);

const finalEmailTemplatePath = path.join(
  __dirname,
  "..",
  ".env",
  "companyA",
  "email",
  "final",
  "template.html"
);
const finalMicrositeTemplatePath = path.join(
  __dirname,
  "..",
  ".env",
  "companyA",
  "microsite",
  "final",
  "template.html"
);

const emailZipPath = path.join(
  __dirname,
  "..",
  ".env",
  "companyA",
  "email",
  "final",
  "companyA.zip"
);

const readContent = (filePath) => {
  try {
    if (path.extname(filePath) === ".json") {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } else {
      return fs.readFileSync(filePath, "utf8");
    }
  } catch (err) {
    console.error(`Error reading file at ${filePath}:`, err.message);
    throw err;
  }
};


const mockJsonDir = path.join(__dirname, "..", ".env");

jest.mock("jszip", () => {
  return jest.fn().mockImplementation(() => {
    return {
      file: jest.fn(),
      generateAsync: jest
        .fn()
        .mockResolvedValue(Buffer.from("mock zip content")),
    };
  });
});

// Setup and teardown
beforeAll(async () => {
  if (!fs.existsSync(emailTemplatePath)) {
    throw new Error(
      `Email template file not found at path: ${emailTemplatePath}`
    );
  }
  if (!fs.existsSync(micrositeTemplatePath)) {
    throw new Error(
      `Microsite template file not found at path: ${micrositeTemplatePath}`
    );
  }

  const emailHtmlContent = readContent(emailTemplatePath);
  const micrositeHtmlContent = readContent(micrositeTemplatePath);

  await request(app)
    .post("/api/create-mapping/email/companyA")
    .send({ html: emailHtmlContent })
    .expect(201);

  await request(app)
    .post("/api/create-mapping/microsite/companyA")
    .send({ html: micrositeHtmlContent })
    .expect(201);
});

afterAll(() => {
  fs.rmSync(mockJsonDir, { recursive: true, force: true });
});

describe("GET /api/mapping/:type/:company", () => {
  it("should return the correct JSON data for companyA email", async () => {
    const res = await request(app)
      .get("/api/mapping/email/companyA")
      .expect("Content-Type", /json/)
      .expect(200);

    const expectedJson = readContent(emailJson);
    expect(res.body).toEqual(expectedJson);
  });

  it("should return the correct JSON data for companyA microsite", async () => {
    const res = await request(app)
      .get("/api/mapping/microsite/companyA")
      .expect("Content-Type", /json/)
      .expect(200);

    const expectedJson = readContent(micrositeJson);
    expect(res.body).toEqual(expectedJson);
  });

  it("should return 404 for a non-existing file", async () => {
    const res = await request(app)
      .get("/api/mapping/email/companyC")
      .expect(404);

    expect(res.text).toBe("File not found");
  });
});

describe("GET /api/:type/template", () => {
  it("should return the email template HTML for type email", async () => {
    const res = await request(app)
      .get("/api/email/template")
      .expect("Content-Type", /html/)
      .expect(200);

    const expectedHtmlContent = readContent(emailTemplatePath);
    expect(res.text).toBe(expectedHtmlContent);
  });

  it("should return the microsite template HTML for type microsite", async () => {
    const res = await request(app)
      .get("/api/microsite/template")
      .expect("Content-Type", /html/)
      .expect(200);

    const expectedHtmlContent = readContent(micrositeTemplatePath);
    expect(res.text).toBe(expectedHtmlContent);
  });

  it("should return 404 for non-existing type", async () => {
    const res = await request(app).get("/api/nonexistent/template").expect(404);

    expect(res.text).toBe("nonexistent isn't an accepted template type");
  });
});

describe("POST /api/create-mapping/:type/:company", () => {
  it("should create the correct JSON mapping file for companyA email", async () => {
    const emailHtmlContent = readContent(emailTemplatePath);

    const res = await request(app)
      .post("/api/create-mapping/email/companyA")
      .send({ html: emailHtmlContent })
      .expect(201);

    const createdMapping = readContent(emailJson);
    expect(createdMapping).toHaveProperty("backgroundColors");
    expect(createdMapping).toHaveProperty("fontColor");
    // Add more expectations based on your mapping structure

    // Ensure the response contains the expected message
    expect(res.text).toBe("Mapping created");
  });

  it("should create the correct JSON mapping file for companyB microsite", async () => {
    const micrositeHtmlContent = readContent(micrositeTemplatePath);

    const res = await request(app)
      .post("/api/create-mapping/microsite/companyB")
      .send({ html: micrositeHtmlContent })
      .expect(201);

    const createdMapping = readContent(micrositeJson);
    expect(createdMapping).toHaveProperty("backgroundColors");
    expect(createdMapping).toHaveProperty("fontColor");
    // Add more expectations based on your mapping structure

    // Ensure the response contains the expected message
    expect(res.text).toBe("Mapping created");
  });

  // it.only("should return 400 if no HTML content is provided", async () => {
  //   const res = await request(app)
  //     .post("/api/create-mapping/email/companyA")
  //     .send({})
  //     .expect(400);

  //   expect(res.text).toBe("HTML content is required");
  // });
});

describe("POST /api/swap", () => {
  beforeAll(async () => {
    // Create the necessary mapping files before testing the swap
    const emailHtmlContent = readContent(emailTemplatePath);
    const micrositeHtmlContent = readContent(micrositeTemplatePath);

    await request(app)
      .post("/api/create-mapping/email/companyA")
      .send({ html: emailHtmlContent })
      .expect(201);

    await request(app)
      .post("/api/create-mapping/microsite/companyA")
      .send({ html: micrositeHtmlContent })
      .expect(201);
  });

  it("should execute the swap and create the final email template for companyA", async () => {
    const res = await request(app)
      .post("/api/swap")
      .send({ type: "email", company: "companyA" })
      .expect(200);

    expect(res.text).toBe("Swap script executed successfully");

    // Ensure the final template is created
    const finalTemplateContent = readContent(finalEmailTemplatePath);
    expect(finalTemplateContent).toContain("Email");
  });

  it("should execute the swap and create the final microsite template for companyA", async () => {
    const res = await request(app)
      .post("/api/swap")
      .send({ type: "microsite", company: "companyA" })
      .expect(200);

    expect(res.text).toBe("Swap script executed successfully");

    // Ensure the final template is created
    const finalTemplateContent = readContent(finalMicrositeTemplatePath);
    expect(finalTemplateContent).toContain("Microsite");
  });

  it("should return 400 if type or company is missing", async () => {
    const res = await request(app)
      .post("/api/swap")
      .send({ type: "email" })
      .expect(400);

    expect(res.text).toContain(`Error executing swap script:`);
  });
});

describe("GET /api/:type/:company/final-template", () => {
  beforeAll(async () => {
    // Ensure the final templates are created using the swap endpoint before testing
    await request(app)
      .post("/api/swap")
      .send({ type: "email", company: "companyA" })
      .expect(200);

    await request(app)
      .post("/api/swap")
      .send({ type: "microsite", company: "companyA" })
      .expect(200);
  });

  it("should return the final email template for companyA", async () => {
    const res = await request(app)
      .get("/api/email/companyA/final-template")
      .expect("Content-Type", /html/)
      .expect(200);

    const expectedHtmlContent = readContent(finalEmailTemplatePath);
    expect(res.text).toBe(expectedHtmlContent);
  });

  it("should return the final microsite template for companyA", async () => {
    const res = await request(app)
      .get("/api/microsite/companyA/final-template")
      .expect("Content-Type", /html/)
      .expect(200);

    const expectedHtmlContent = readContent(finalMicrositeTemplatePath);
    expect(res.text).toBe(expectedHtmlContent);
  });

  it("should return 404 for non-existing final template", async () => {
    const res = await request(app)
      .get("/api/email/companyC/final-template")
      .expect(404);

    expect(res.text).toBe("File not found");
  });
});

describe("POST /api/create-download", () => {
  beforeAll(async () => {

    fs.writeFileSync(
      finalEmailTemplatePath,
      "<html><body>Email Template</body></html>",
      "utf8"
    );
    fs.mkdirSync(
      path.join(
        __dirname,
        "..",
        ".env",
        "companyA",
        "email",
        "final",
        "images"
      ),
      { recursive: true }
    );
    fs.writeFileSync(
      path.join(
        __dirname,
        "..",
        ".env",
        "companyA",
        "email",
        "final",
        "images",
        "image.png"
      ),
      "mock image content",
      "utf8"
    );
    fs.writeFileSync(
      finalMicrositeTemplatePath,
      "<html><body>Microsite Template</body></html>",
      "utf8"
    );
  });

  it("should create a ZIP file and send it for download for email type", async () => {
    const res = await request(app)
      .post("/api/create-download")
      .send({ type: "email", company: "companyA" })
      .expect(200);


    const zipExists = fs.existsSync(emailZipPath);
    expect(zipExists).toBe(true);


    expect(res.headers["content-disposition"]).toContain(
      'attachment; filename="companyA.zip"'
    );
  });

  it("should copy the HTML content to clipboard for microsite type", async () => {

    const res = await request(app)
      .post("/api/create-download")
      .send({ type: "microsite", company: "companyA" })
      .expect(200);

    const expectedHtmlContent = readContent(finalMicrositeTemplatePath);
    expect(res.text).toBe(expectedHtmlContent);
  }); 

  it("should return 400 if type or company is missing", async () => {
    const res = await request(app)
      .post("/api/create-download")
      .send({ type: "email" })
      .expect(400);

    expect(res.text).toBe("Error creating zip file");
  });
});

describe('PATCH /api/update-mapping/:type/:company', () => {
  it('should update the mapping JSON file with new data for email type', async () => {
    const initialMapping = readContent(emailJson);

    const newMappingData = {
      backgroundColors: {
        Background0: {
          oldBackground: "rgb(112, 199, 213)",
          newBackground: "rgb(255, 255, 255)"
        }
      }
    };

    await request(app)
      .patch('/api/update-mapping/email/companyA')
      .send(newMappingData)
      .expect(200);

    const updatedMapping = readContent(emailJson);
    expect(updatedMapping.backgroundColors.Background0.newBackground).toBe("rgb(255, 255, 255)");

    // Ensure other data remains unchanged
    expect(updatedMapping).toMatchObject({
      ...initialMapping,
      backgroundColors: {
        Background0: {
          ...initialMapping.backgroundColors.Background0,
          newBackground: "rgb(255, 255, 255)"
        }
      }
    });
  });

  it('should update the mapping JSON file with new data for microsite type', async () => {
    const initialMapping = readContent(micrositeJson);

    const newMappingData = {
      backgroundColors: {
        Background0: {
          oldBackground: "rgb(25, 4, 199)",
          newBackground: "rgb(0, 0, 0)"
        }
      }
    };

    await request(app)
      .patch('/api/update-mapping/microsite/companyB')
      .send(newMappingData)
      .expect(200);

    const updatedMapping = readContent(micrositeJson);
    expect(updatedMapping.backgroundColors.Background0.newBackground).toBe("rgb(0, 0, 0)");

    // Ensure other data remains unchanged
    expect(updatedMapping).toMatchObject({
      ...initialMapping,
      backgroundColors: {
        Background0: {
          ...initialMapping.backgroundColors.Background0,
          newBackground: "rgb(0, 0, 0)"
        }
      }
    });
  });

  it.only('should return 500 if the mapping JSON file cannot be read', async () => {
    const invalidJsonPath = path.join(__dirname, '..', '.env', 'companyC', 'email', 'json', 'mapping.json');
    fs.writeFileSync(invalidJsonPath, 'invalid json');

    const newMappingData = {
      backgroundColors: {
        Background0: {
          oldBackground: "rgb(112, 199, 213)",
          newBackground: "rgb(255, 255, 255)"
        }
      }
    };

    const res = await request(app)
      .patch('/api/update-mapping/email/companyC')
      .send(newMappingData)
      .expect(500);

    expect(res.text).toBe("Error updating mapping");

    fs.rmSync(path.join(__dirname, '..', '.env', 'companyC'), { recursive: true, force: true });
  });

  it('should return 500 if the mapping JSON file cannot be written', async () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => {
      throw new Error('Write error');
    });

    const newMappingData = {
      backgroundColors: {
        Background0: {
          oldBackground: "rgb(112, 199, 213)",
          newBackground: "rgb(255, 255, 255)"
        }
      }
    };

    const res = await request(app)
      .patch('/api/update-mapping/email/companyA')
      .send(newMappingData)
      .expect(500);

    expect(res.text).toBe("Error updating mapping");
  });
});
