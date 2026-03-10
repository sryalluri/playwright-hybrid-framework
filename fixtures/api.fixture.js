//import { test as base } from '@playwright/test';
import { AuthAPI } from '../api/AuthAPI.js';
import loginData from '../testData/loginData.json' assert { type: "json" };

export const apiFixtures = {
  authData: async ({ request }, use) => {

    const authAPI = new AuthAPI(request);
    const authData = await authAPI.getToken(loginData);

    await use(authData);

  }
};