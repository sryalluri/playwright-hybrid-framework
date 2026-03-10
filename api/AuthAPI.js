export class AuthAPI {

    constructor(request) {
        this.request = request;
    }

    async getToken(loginPayload) {
        console.log("loginPayload:", JSON.stringify(loginPayload));
        const response = await this.request.post(
            "https://rahulshettyacademy.com/api/ecom/auth/login",
            {
                data: loginPayload
            }
        );
        let authData = {};
        // check response status
        if (response.status() === 200) {

            const responseBody = await response.json();

            console.log("Login Response:", JSON.stringify(responseBody, null, 2));

            const token = responseBody.token;
            const userId = responseBody.userId;

            console.log("Generated Token:", token);
            console.log("UserId:", userId);
            authData.token = responseBody.token;
            authData.userId = responseBody.userId;
            return authData;

        } else {
            throw new Error("Login API Failed. Status: " + response.status());
        }

    }
}