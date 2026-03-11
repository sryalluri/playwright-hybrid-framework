import { ENV } from '../config/env.js';


export class APIUtils {

    constructor(request) {
        this.request = request;
    }

    async getProductId(token, productPayload, productName) {

        const response = await this.request.post(
            `${ENV.API_BASE_URL}/api/ecom/product/get-all-products`,
            {
                headers: {
                    Authorization: token
                },
                data: productPayload
            }
        );

        const responseBody = await response.json();
        console.log("Product Object: ", JSON.stringify(responseBody.data))
        const product = responseBody.data.find(
            p => p.productName === productName
        );

        return product._id;
    }

    async addToCart(token, userId, productId, addToCartPayload) {

        // Deep copy to avoid modifying original JSON
        const payload = JSON.parse(JSON.stringify(addToCartPayload));

        // Inject dynamic values
        payload._id = userId;
        payload.product._id = productId;

        //console.log("Final Payload:", JSON.stringify(payload));

        const response = await this.request.post(
            `${ENV.API_BASE_URL}/api/ecom/user/add-to-cart`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json"
                },
                data: payload
            }
        );
        const status = response.status();
        console.log("Status:", status);

        if (status === 200) {
            const responseBody = await response.json();
            console.log("Success Response:", responseBody);
            return responseBody;
        } else {
            const errorText = await response.text();
            throw new Error(
                `Add To Cart API Failed | Status: ${status} | Response: ${errorText}`
            );
        }
    }

    async createOrder(token, productId, orderPayload) {

        // Deep copy to avoid modifying original JSON
        const payload = JSON.parse(JSON.stringify(orderPayload));

        payload.orders[0].productOrderedId = productId;

        console.log("Order Final Payload:", JSON.stringify(payload));

        const response = await this.request.post(
            `${ENV.API_BASE_URL}/api/ecom/order/create-order`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json"
                },
                data: payload
            }
        );
        const status = response.status();
        console.log("Status:", status);

        if (status === 201) {
            const responseBody = await response.json();
            console.log("Success Response:", responseBody);
            return responseBody;
        } else {
            const errorText = await response.text();
            throw new Error(
                `Creation of Order API Failed | Status: ${status} | Response: ${errorText}`
            );
        }
    }

    async getOrderDetails(token, orderId) {

        const response = await this.request.get(
            `${ENV.API_BASE_URL}/api/ecom/order/get-orders-details?id=${orderId}`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json"
                }
            }
        );
        const status = response.status();
        console.log("Status:", status);

        if (status === 200) {
            const responseBody = await response.json();
            console.log("Order Success Response:", responseBody);
            return responseBody;
        } else {
            const errorText = await response.text();
            throw new Error(
                `Get Order Details API Failed | Status: ${status} | Response: ${errorText}`
            );
        }
    }

    async deleteOrder(token, orderId, productId, orderPayload) {

        // Deep copy to avoid modifying original JSON
        const payload = JSON.parse(JSON.stringify(orderPayload));

        payload.orders[0].productOrderedId = productId;

        console.log("Order Final Payload:", JSON.stringify(payload));

        const response = await this.request.delete(
            `${ENV.API_BASE_URL}/api/ecom/order/delete-order/${orderId}`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json"
                },
                data: payload
            }
        );
        const status = response.status();
        console.log("Status:", status);

        if (status === 200) {
            const responseBody = await response.json();
            console.log("Order Success Response:", responseBody);
            return responseBody;
        } else {
            const errorText = await response.text();
            throw new Error(
                `Get Order Details API Failed | Status: ${status} | Response: ${errorText}`
            );
        }
    }

}