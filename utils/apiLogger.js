import { attachment } from "allure-js-commons";

export async function apiRequest(request, method, url, options = {}) {

    // Attach request details
    attachment(
        "API Request URL",
        url,
        "text/plain"
    );

    attachment(
        "API Request Method",
        method,
        "text/plain"
    );

    if (options.data) {
        attachment(
            "API Request Payload",
            JSON.stringify(options.data, null, 2),
            "application/json"
        );
    }

    if (options.headers) {
        attachment(
            "API Request Headers",
            JSON.stringify(options.headers, null, 2),
            "application/json"
        );
    }

    // Execute request
    const response = await request[method](url, options);

    const status = response.status();

    attachment(
        "API Status Code",
        status.toString(),
        "text/plain"
    );

    try {

        const body = await response.json();

        attachment(
            "API Response",
            JSON.stringify(body, null, 2),
            "application/json"
        );

    } catch {

        const text = await response.text();

        attachment(
            "API Response",
            text,
            "text/plain"
        );
    }

    return response;
}