import { test, expect } from '../../fixtures/test.fixture.js';
import { APIUtils } from '../../utils/APIUtils.js';
import productPayload from '../../testData/productPayload.json';
import loginData from '../../testData/loginData.json' assert { type: "json" };
import addToCartPayload from '../../testData/addToCartPayload.json';
import orderPayload from '../../testData/orderPayload.json';



test.describe('Hybrid - Add To Cart Flow', () => {

    test('Add product via API and validate in UI', async ({ page, request, authData }) => {

        // -----------------------------------------
        // Step 1: Extract auth data from fixture
        // -----------------------------------------
        const { token, userId } = authData;

        console.log("Token:", token);
        console.log("UserId:", userId);

        const apiUtils = new APIUtils(request);

        // -----------------------------------------
        // Step 2: Get Product ID from API
        // -----------------------------------------
        const productName = "ADIDAS ORIGINAL";

        const productId = await apiUtils.getProductId(
            token,
            productPayload,
            productName
        );

        console.log("ProductId:", productId);

        // -----------------------------------------
        // Step 3: Add Product to Cart via API
        // -----------------------------------------
        const cartResponse = await apiUtils.addToCart(
            token,
            userId,
            productId,
            addToCartPayload.cartPayLoad
        );

        expect(cartResponse.message).toBe("Product Added To Cart");

        // -----------------------------------------
        // Step 4: Navigate to Dashboard (UI)
        // -----------------------------------------
        await page.goto('https://rahulshettyacademy.com/client/#/dashboard/dash');

        await expect(page).toHaveURL(/#\/dashboard/);

        await page.locator("//button[@routerlink='/dashboard/myorders']").click();

        await clearAllOrders(page);
        // -----------------------------------------
        // Step 5: Go to Cart
        // -----------------------------------------
        await page.locator("//button[@routerlink='/dashboard/myorders']/parent::li/following-sibling::li/button[@routerlink='/dashboard/cart']").click();

        // -----------------------------------------
        // Step 6: Validate Product in Cart
        // -----------------------------------------
        const productLocator = page.getByText(productName);

        await expect(productLocator).toBeVisible({ timeout: 10000 });

        console.log("Product successfully validated in UI.");

        const text = await productLocator.textContent();
        console.log("Product Title:", text);
        await expect(productLocator).toHaveText("ADIDAS ORIGINAL");

        // -----------------------------------------
        // Step 7: Create Order
        // -----------------------------------------
        const orderResponse = await apiUtils.createOrder(
            token,
            productId,
            orderPayload.createOrderPayload
        );

        expect(orderResponse.message).toBe(addToCartPayload.getOrderDet.message);

        const orderId = orderResponse.orders[0];
        console.log("Created Order ID:", orderId);

        // -----------------------------------------
        // Step 8: Go to Orders
        // -----------------------------------------
        await page.locator("//button[@routerlink='/dashboard/myorders']").click();

        // -----------------------------------------
        // Step 9: Validate Product in Cart
        // -----------------------------------------
        const headerLocator = page.locator("//td[contains(text(),'ADIDAS ORIGINAL')]/preceding-sibling::th");

        // Get the text value
        const headerValue = await headerLocator.textContent();

        console.log(`The value is: ${headerValue}`);

        expect(headerValue.trim()).toBe(orderId);

        // -----------------------------------------
        // Step 10: Get Order Details
        // -----------------------------------------
        const orderDetails = await apiUtils.getOrderDetails(
            token,
            orderId
        );

        expect(orderDetails.message).toBe("Orders fetched for customer Successfully");

        const orderBY = orderDetails.data.orderBy;
        console.log("Created Order By:", orderBY);
        expect(orderBY).toBe(orderPayload.orderDetails.data.orderBy);

        // -----------------------------------------
        // Step 11: Delete Order Details
        // -----------------------------------------
        const deleteDetails = await apiUtils.deleteOrder(
            token,
            orderId,
            productId,
            orderPayload.createOrderPayload
        );

        expect(deleteDetails.message).toBe("Orders Deleted Successfully");
    });

    async function clearAllOrders(page) {

        const deleteLocator = page.locator("//button[contains(text(),'Delete')]");

        let count = await deleteLocator.count();
        console.log("Initial Order Count:", count);

        while (count > 0) {

            await deleteLocator.first().click();

            // Wait until count decreases
            await expect(deleteLocator).toHaveCount(count - 1, { timeout: 10000 });

            count = await deleteLocator.count();
            console.log("Remaining Orders:", count);
        }
    }

});