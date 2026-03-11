// pages/OrderPage.js
import { expect } from '@playwright/test';
import { Logger } from '../utils/logger.js';

export class OrderPage {

  constructor(page) {
    this.page = page;
    this.deleteButtons = page.locator("//button[contains(text(),'Delete')]");
  }

  async clearAllOrders() {
    let count = await this.deleteButtons.count();
    Logger.info(`Initial Order Count: ${count}`);

    while (count > 0) {
      await this.deleteButtons.first().click();
      await expect(this.deleteButtons)
        .toHaveCount(count - 1, { timeout: 10000 });

      count = await this.deleteButtons.count();
      Logger.info(`Remaining Orders: ${count}`);
    }
  }

  async getOrderIdForProduct(productName) {
    const locator = this.page.locator(
      `//td[contains(text(),'${productName}')]/preceding-sibling::th`
    );

    return (await locator.textContent()).trim();
  }
}