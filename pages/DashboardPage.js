// pages/DashboardPage.js
export class DashboardPage {

  constructor(page) {
    this.page = page;

    this.myOrdersBtn = page.locator("//button[@routerlink='/dashboard/myorders']");
    this.cartBtn = page.locator(
      "//button[@routerlink='/dashboard/myorders']/parent::li/following-sibling::li/button[@routerlink='/dashboard/cart']"
    );
  }

  async gotoDashboard() {
    await this.page.goto('/client/#/dashboard/dash');
  }

  async goToOrders() {
    await this.myOrdersBtn.click();
  }

  async goToCart() {
    await this.cartBtn.click();
  }
}