const { json, standardResponse } = require("/opt/nodejs/utils");
const { createLogger } = require("/opt/nodejs/shared_logger");
const { dynamoGet } = require("/opt/nodejs/shared_dynamo");

var logger = createLogger(process.env.SERVICE_NAME);

exports.handler = async (event, context = undefined) => {
    logger = createLogger(process.env.SERVICE_NAME, context);

    const headers = {
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
    };

    try {
        const sub = event.requestContext?.authorizer?.claims?.sub;

        if (!sub) {
            return json(401, standardResponse({ success: false, code: "UNAUTHORIZED", message: "Missing authenticated user" }), headers, event);
        }

        const item = await dynamoGet(`USER#${sub}`, "PROFILE");

        if (!item) {
            return json(404, standardResponse({ success: false, code: "NOT_FOUND", message: "User profile not found" }), headers, event);
        }

        logger.info("User profile retrieved successfully", { sub });

        return json(200, standardResponse({ success: true, code: "OK", message: "User profile retrieved successfully", data: item }), headers, event);
    } catch (error) {
        logger.error("Error retrieving user profile", { error: error.message });
        return json(500, standardResponse({ success: false, code: "INTERNAL_SERVER_ERROR", message: "An error occurred while retrieving the user profile" }), headers, event);
    }
};
