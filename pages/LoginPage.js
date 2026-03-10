export class LoginPage {

  constructor(page) {

    this.page = page;

    this.email = page.locator("#userEmail");
    this.password = page.locator("#userPassword");
    this.loginButton = page.locator("#login");
  }

  async goto() {
    await this.page.goto("https://rahulshettyacademy.com/client");
  }

  async login(email, password) {

    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();

  }
}