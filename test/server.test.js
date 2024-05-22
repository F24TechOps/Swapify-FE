import request from 'supertest';
import path from 'path';
import fs from 'fs';
import app from '../src/server'; // Import the Express app

const emailTemplatePath = path.join(__dirname, '..', 'src', 'html', 'email', 'base1', 'template.html');
const micrositeTemplatePath = path.join(__dirname, '..', 'src', 'html', 'microsite', 'base1', 'template.html');

// Function to read HTML content with error handling
const readHtmlContent = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Error reading file at ${filePath}:`, err.message);
    throw err;
  }
};

// Mock the path to JSON files
const mockJsonDir = path.join(__dirname, '..', '.env');

// Setup and teardown
beforeAll(async () => {
  console.log(`Email template path: ${emailTemplatePath}`);
  console.log(`Microsite template path: ${micrositeTemplatePath}`);

  if (!fs.existsSync(emailTemplatePath)) {
    throw new Error(`Email template file not found at path: ${emailTemplatePath}`);
  }
  if (!fs.existsSync(micrositeTemplatePath)) {
    throw new Error(`Microsite template file not found at path: ${micrositeTemplatePath}`);
  }

  const emailHtmlContent = readHtmlContent(emailTemplatePath);
  const micrositeHtmlContent = readHtmlContent(micrositeTemplatePath);

  await request(app)
    .post('/api/create-mapping/email/companyA')
    .send({ html: emailHtmlContent })
    .expect(201);
  
  await request(app)
    .post('/api/create-mapping/microsite/companyB')
    .send({ html: micrositeHtmlContent })
    .expect(201);
});

afterAll(() => {
  fs.rmSync(mockJsonDir, { recursive: true, force: true });
});

describe('GET /api/mapping/:type/:company', () => {
  it.only("should return the correct JSON data for companyA email", async () => {
    const res = await request(app)
      .get("/api/mapping/email/companyA")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toHaveProperty("backgroundColors.Background0.oldBackground", "rgb(112, 199, 213)");
  });

  it("should return the correct JSON data for companyB microsite", async () => {
    const res = await request(app)
      .get("/api/mapping/microsite/companyB")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toMatchObject({ backgroundColors: { Background0: { oldBackground: "rgb(112, 199, 213)" } } });
  });

  it("should return 404 for a non-existing file", async () => {
    const res = await request(app)
      .get("/api/mapping/email/companyC")
      .expect(404);

    expect(res.text).toBe("File not found");
  });

  it("should return 400 for an invalid file extension", async () => {
    const res = await request(app)
      .get("/api/mapping/email/companyA/invalid.txt")
      .expect(400);

    expect(res.text).toBe("Not a JSON file");
  });
});