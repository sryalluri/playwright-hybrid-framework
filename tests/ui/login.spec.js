import { test, expect } from '../../fixtures/test.fixture.js';
import { APIUtils } from '../../utils/APIUtils.js';
import { DashboardPage } from '../../pages/DashboardPage.js';

import { CartPage } from '../../pages/CartPage.js';
import { OrderPage } from '../../pages/OrderPage.js';
import productPayload from '../../testData/productPayload.json';
import addToCartPayload from '../../testData/addToCartPayload.json';
import orderPayload from '../../testData/orderPayload.json';
import { Logger } from '../../utils/logger.js';

test.describe('Hybrid - Add To Cart Flow', () => {

  test('Add product via API and validate in UI', async ({ page, request, authData }) => {

    const { token, userId } = authData;

    const apiUtils = new APIUtils(request);
    const dashboard = new DashboardPage(page);
    const ordersPage = new OrderPage(page);
    const cartPage = new CartPage(page);

    const productName = "ADIDAS ORIGINAL";

    let productId;
    let orderId;

    // ================================
    await test.step('Step 1: Fetch Product ID via API', async () => {
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
      await dashboard.gotoDashboard();
      await expect(page).toHaveURL(/#\/dashboard/);
    });

    // ================================
    await test.step('Step 4: Clear Existing Orders from UI', async () => {
      await dashboard.goToOrders();
      await ordersPage.clearAllOrders();
    });

    // ================================
    await test.step('Step 5: Validate Product in Cart (UI)', async () => {
      await dashboard.goToCart();
      await cartPage.validateProduct(productName);

      Logger.info("Product validated in cart UI.");
    });

    // ================================
    await test.step('Step 6: Create Order via API', async () => {
      const orderResponse = await apiUtils.createOrder(
        token,
        productId,
        orderPayload.createOrderPayload
      );

      expect(orderResponse.message)
        .toBe(addToCartPayload.getOrderDet.message);

      orderId = orderResponse.orders[0];
      Logger.info(`Order Created: ${orderId}`);
      expect(orderId).toBeTruthy();
    });

    // ================================
    await test.step('Step 7: Validate Order ID in UI', async () => {
      await dashboard.goToOrders();

      const uiOrderId =
        await ordersPage.getOrderIdForProduct(productName);

      Logger.info(`Order ID from UI: ${uiOrderId}`);
      expect(uiOrderId).toBe(orderId);
    });

    // ================================
    await test.step('Step 8: Fetch Order Details via API', async () => {
      const orderDetails =
        await apiUtils.getOrderDetails(token, orderId);

      expect(orderDetails.message)
        .toBe("Orders fetched for customer Successfully");

      const orderBy = orderDetails.data.orderBy;
      Logger.info(`Order created by: ${orderBy}`);

      expect(orderBy)
        .toBe(orderPayload.orderDetails.data.orderBy);
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

});