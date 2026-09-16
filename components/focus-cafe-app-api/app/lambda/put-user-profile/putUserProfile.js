const { json, standardResponse, validateNoUnknownFields } = require("/opt/nodejs/utils");
const { createLogger } = require("/opt/nodejs/shared_logger");
const { dynamoPut } = require("/opt/nodejs/shared_dynamo");

var logger = createLogger(process.env.SERVICE_NAME);

const ALLOWED_FIELDS = ["displayName", "preferences"];

exports.handler = async (event, context = undefined) => {
    logger = createLogger(process.env.SERVICE_NAME, context);

    const headers = {
        "Access-Control-Allow-Methods": "PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
    };

    try {
        const sub = event.requestContext?.authorizer?.claims?.sub;

        if (!sub) {
            return json(401, standardResponse({ success: false, code: "UNAUTHORIZED", message: "Missing authenticated user" }), headers, event);
        }

        const payload = JSON.parse(event.body || "{}");
        validateNoUnknownFields(payload, ALLOWED_FIELDS);

        const fields = { ...payload, updatedAt: new Date().toISOString() };
        await dynamoPut(`USER#${sub}`, "PROFILE", fields);
        const item = { PK: `USER#${sub}`, SK: "PROFILE", ...fields };

        logger.info("User profile updated successfully", { sub });

        return json(200, standardResponse({ success: true, code: "OK", message: "User profile updated successfully", data: item }), headers, event);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        logger.error("Error updating user profile", { error: error.message });
        return json(statusCode, standardResponse({ success: false, code: error.code || "INTERNAL_SERVER_ERROR", message: statusCode === 500 ? "An error occurred while updating the user profile" : error.message }), headers, event);
    }
};
