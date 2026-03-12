import fs from "fs";
import path from "path";

export function writeEnvironmentInfo() {

  const resultsDir = "allure-results";

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }

  const env = process.env.TEST_ENV || "LOCAL";

  const content = `
Environment=${env}
Browser=Chromium
Framework=Playwright
NodeVersion=${process.version}
`;

  fs.writeFileSync(
    path.join(resultsDir, "environment.properties"),
    content.trim()
  );
}