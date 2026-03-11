// global-setup.js
import { chromium } from '@playwright/test';
//import loginData from './testData/loginData.json' assert { type: "json" };
import loginData from '../testData/loginData.json' assert { type: "json" };



async function globalSetup() {
  const browser = await chromium.launch();
 const page = await browser.newPage();

  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

  await page.fill("#userEmail", loginData.userEmail);
  await page.fill("#userPassword", loginData.userPassword);

  await Promise.all([
    page.waitForURL(/#\/dashboard/),
    page.click('#login')
  ]);

  console.log("Login successful. Current URL:", page.url());

  await page.context().storageState({ path: 'storageState.json' });

  await browser.close();
}

export default globalSetup;