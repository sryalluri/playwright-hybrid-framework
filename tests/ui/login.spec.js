import { test, expect } from '../../fixtures/test.fixture.js';
import { APIUtils } from '../../utils/APIUtils.js';
import productPayload from '../../testData/productPayload.json';
import addToCartPayload from '../../testData/addToCartPayload.json';
import orderPayload from '../../testData/orderPayload.json';
import { Logger } from '../../utils/logger.js';

test.describe('Hybrid - Add To Cart Flow', () => {

  test('Add product via API and validate in UI', async ({ page, request, authData }) => {

    const { token, userId } = authData;
    const apiUtils = new APIUtils(request);
    const productName = "ADIDAS ORIGINAL";

    let productId;
    let orderId;

    // ================================
    await test.step('Step 1: Get Product ID via API', async () => {
      productId = await apiUtils.getProductId(
        token,
        productPayload,
        productName
      );

      Logger.info(`Product ID: ${productId}`);
      expect(productId).toBeTruthy();
    });

    // ================================
    await test.step('Step 2: Add Product To Cart via API', async () => {
      const cartResponse = await apiUtils.addToCart(
        token,
        userId,
        productId,
        addToCartPayload.cartPayLoad
      );

      Logger.info(`Cart Response: ${JSON.stringify(cartResponse)}`);
      expect(cartResponse.message).toBe("Product Added To Cart");
    });

    // ================================
    await test.step('Step 3: Navigate to Dashboard', async () => {
      await page.goto('/client/#/dashboard/dash');
      await expect(page).toHaveURL(/#\/dashboard/);
    });

    // ================================
    await test.step('Step 4: Clear Existing Orders', async () => {
      await page.locator("//button[@routerlink='/dashboard/myorders']").click();
      await clearAllOrders(page);
    });

    // ================================
    await test.step('Step 5: Validate Product in Cart (UI)', async () => {
      await page.locator("//button[@routerlink='/dashboard/myorders']/parent::li/following-sibling::li/button[@routerlink='/dashboard/cart']").click();

      const productLocator = page.getByText(productName);
      await expect(productLocator).toBeVisible({ timeout: 10000 });
      await expect(productLocator).toHaveText(productName);

      Logger.info("Product validated successfully in UI cart.");
    });

    // ================================
    await test.step('Step 6: Create Order via API', async () => {
      const orderResponse = await apiUtils.createOrder(
        token,
        productId,
        orderPayload.createOrderPayload
      );

      expect(orderResponse.message).toBe(addToCartPayload.getOrderDet.message);

      orderId = orderResponse.orders[0];
      Logger.info(`Order Created: ${orderId}`);
      expect(orderId).toBeTruthy();
    });

    // ================================
    await test.step('Step 7: Validate Order ID in UI', async () => {
      await page.locator("//button[@routerlink='/dashboard/myorders']").click();

      const headerLocator = page.locator(
        `//td[contains(text(),'${productName}')]/preceding-sibling::th`
      );

      const headerValue = (await headerLocator.textContent()).trim();
      Logger.info(`Order ID from UI: ${headerValue}`);

      expect(headerValue).toBe(orderId);
    });

    // ================================
    await test.step('Step 8: Get Order Details via API', async () => {
      const orderDetails = await apiUtils.getOrderDetails(token, orderId);

      expect(orderDetails.message)
        .toBe("Orders fetched for customer Successfully");

      const orderBy = orderDetails.data.orderBy;
      Logger.info(`Order created by: ${orderBy}`);

      expect(orderBy).toBe(orderPayload.orderDetails.data.orderBy);
    });

    // ================================
    await test.step('Step 9: Delete Order via API', async () => {
      const deleteDetails = await apiUtils.deleteOrder(
        token,
        orderId,
        productId,
        orderPayload.createOrderPayload
      );

      expect(deleteDetails.message)
        .toBe("Orders Deleted Successfully");

      Logger.info("Order deleted successfully.");
    });

  });


  // ==========================================
  // Utility: Clear Orders in UI
  // ==========================================
  async function clearAllOrders(page) {

    const deleteLocator = page.locator("//button[contains(text(),'Delete')]");
    let count = await deleteLocator.count();

    Logger.info(`Initial Order Count: ${count}`);

    while (count > 0) {
      await deleteLocator.first().click();
      await expect(deleteLocator).toHaveCount(count - 1, { timeout: 10000 });
      count = await deleteLocator.count();
      Logger.info(`Remaining Orders: ${count}`);
    }
  }

});