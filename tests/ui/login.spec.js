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

    test('Add product via API and validate in UI', async ({
        authData,
        apiUtils,
        dashboardPage,
        OrderPage,
        cartPage
    }) => {

        const { token, userId } = authData;

        //const apiUtils = new APIUtils(request);

        const productName = "ADIDAS ORIGINAL";

        let productId;
        let orderId;

        await test.step('Step 1: Fetch Product ID via API', async () => {

            productId = await apiUtils.getProductId(
                token,
                productPayload,
                productName
            );

            expect(productId).toBeTruthy();
        });

        await test.step('Step 2: Add Product To Cart via API', async () => {

            const cartResponse = await apiUtils.addToCart(
                token,
                userId,
                productId,
                addToCartPayload.cartPayLoad
            );

            expect(cartResponse.message).toBe("Product Added To Cart");

        });

        await test.step('Step 3: Navigate to Dashboard', async () => {

            await dashboardPage.gotoDashboard();

        });

        await test.step('Step 4: Clear Existing Orders', async () => {

            await dashboardPage.goToOrders();
            await OrderPage.clearAllOrders();

        });

        await test.step('Step 5: Validate Product in Cart', async () => {

            await dashboardPage.goToCart();
            await cartPage.validateProduct(productName);

        });

        await test.step('Step 6: Create Order', async () => {

            const orderResponse = await apiUtils.createOrder(
                token,
                productId,
                orderPayload.createOrderPayload
            );

            orderId = orderResponse.orders[0];

        });

        await test.step('Step 7: Validate Order ID in UI', async () => {

            await dashboardPage.goToOrders();

            const uiOrderId =
                await OrderPage.getOrderIdForProduct(productName);

            expect(uiOrderId).toBe(orderId);

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

});