// pages/CartPage.js
import { expect } from '@playwright/test';

export class CartPage {

  constructor(page) {
    this.page = page;
  }

  async validateProduct(productName) {
    const productLocator = this.page.getByText(productName);

    await expect(productLocator).toBeVisible({ timeout: 10000 });
    await expect(productLocator).toHaveText(productName);
  }
}