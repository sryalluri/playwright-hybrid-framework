import dotenv from 'dotenv';
import path from 'path';

// Default to QA if not provided
const envName = process.env.TEST_ENV || 'qa';

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${envName}`)
});

export const ENV = {
  API_BASE_URL: process.env.API_BASE_URL,
  UI_BASE_URL: process.env.UI_BASE_URL,
  USER_EMAIL: process.env.USER_EMAIL,
  USER_PASSWORD: process.env.USER_PASSWORD
};