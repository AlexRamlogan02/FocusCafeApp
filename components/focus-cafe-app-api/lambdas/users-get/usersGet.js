const { json, standardResponse } = require("/opt/nodejs/utils/response");

exports.handler = async (event) => {
  const userId = event?.pathParameters?.userId || null;

  return json(
    200,
    standardResponse({
      success: true,
      code: "USERS_GET_OK",
      message: "User profile fetched",
      data: { userId },
      meta: { requestId: event?.requestContext?.requestId },
    }),
  );
};
