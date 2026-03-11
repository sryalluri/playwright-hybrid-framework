//import { test as base } from '@playwright/test';
import { AuthAPI } from '../api/AuthAPI.js';
import loginData from '../testData/loginData.json' assert { type: "json" };
import { ENV } from '../config/env.js';

export const apiFixtures = {
    
    authData: async ({ request }, use) => {
        const response = await request.post(`${ENV.API_BASE_URL}/api/ecom/auth/login`, {
            data: loginData
        });
        const status = response.status();

        if (status !== 200) {
            throw new Error(`Login API Failed. Status: ${status}`);
        }

        const responseBody = await response.json();

        console.log("Login Response:", JSON.stringify(responseBody, null, 2));

        const authData = {
            token: responseBody.token,
            userId: responseBody.userId
        };

        console.log("Generated Token:", authData.token);
        console.log("UserId:", authData.userId);

        // 🔥 THIS is what makes it a Playwright fixture
        await use(authData);
    }
};