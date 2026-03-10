import { LoginPage } from '../pages/LoginPage';

export const uiFixtures = {
  loginPage: async ({ page }, use) => {

    const loginPage = new LoginPage(page);

    await use(loginPage);

  }
};