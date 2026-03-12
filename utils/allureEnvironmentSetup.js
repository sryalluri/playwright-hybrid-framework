import fs from "fs";

async function globalSetup() {

  const resultsDir = "allure-results";

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }

  const content = `
Browser=Chromium
Environment=${process.env.TEST_ENV || "QA"}
BaseURL=${process.env.API_BASE_URL}
Framework=Playwright
`;

  fs.writeFileSync(`${resultsDir}/environment.properties`, content);
}

export default globalSetup;