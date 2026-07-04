const { json, standardResponse } = require("/opt/nodejs/utils/response");

exports.handler = async (event) => {
  return json(
    200,
    standardResponse({
      success: true,
      code: "APP_DATA_GET_OK",
      message: "Application data fetched",
      data: {
        appVersion: "dev",
      },
      meta: { requestId: event?.requestContext?.requestId },
    }),
  );
};
