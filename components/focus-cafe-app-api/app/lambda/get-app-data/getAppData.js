const { json, standardResponse } = require("/opt/nodejs/utils");
const { createLogger } = require("/opt/nodejs/shared_logger");

const {
    client,
    handleOrigin
} = require("/opt/nodejs/shared_utils");

const {
    getTableName,
    dynamoGet
} = require("/opt/nodejs/shared_dynamo");

const tableName = getTableName();

var logger = createLogger(process.env.SERVICE_NAME);

exports.handler = async (event, context = undefined) => {
    //adding context to logger
    logger = createLogger(process.env.SERVICE_NAME, context);

    let returnData = {
        headers: {
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Credentials": "true",
        }
    };

    try {
        const PK = "APP";
        const SK = "DATA";

        const item = await dynamoGet(PK, SK);
        logger.info("App data retrieved successfully", { PK, SK });

        validateReturnData(item);

        return json(200, standardResponse({ success: true, code: 202, message: "App data retrieved successfully", data: item }), returnData.headers, event);
    } catch (error) {
        logger.error("Error retrieving app data", { error: error.message });
        return json(500, standardResponse({ success: false, code: "INTERNAL_SERVER_ERROR", message: "An error occurred while retrieving app data" }), returnData.headers, event);
    }   
};

validateReturnData = (data) => {
    var error = new Error();

    if (!data || typeof data !== 'object') {
        error.message = "Invalid data: Data must be a non-null object.";
        error.statusCode = 400;
        logger.errorLog("Invalid data: Data must be a non-null object.", { data });
        throw error;
    }

    if(!data.menu){
        error.message = "Invalid data: Missing 'menu' property.";
        error.statusCode = 400;
        logger.errorLog("Invalid data: Missing 'menu' property.", { data });
        throw error;
    }
}
