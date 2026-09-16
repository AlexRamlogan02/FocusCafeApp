const { createLogger } = require("/opt/nodejs/shared_logger");
const { dynamoPut } = require("/opt/nodejs/shared_dynamo");

var logger = createLogger(process.env.SERVICE_NAME);

// Cognito Post Confirmation trigger: creates the DynamoDB user profile record after signup verification.
exports.handler = async (event, context = undefined) => {
    logger = createLogger(process.env.SERVICE_NAME, context);

    try {
        const sub = event.request.userAttributes.sub;
        const email = event.request.userAttributes.email;

        await dynamoPut(`USER#${sub}`, "PROFILE", {
            email,
            createdAt: new Date().toISOString(),
        });

        logger.info("User profile created after confirmation", { sub });
    } catch (error) {
        logger.error("Error creating user profile after confirmation", { error: error.message });
        // Cognito requires the original event to be returned, and swallowing errors here
        // avoids blocking the user's signup confirmation on a profile-creation failure.
    }

    return event;
};
