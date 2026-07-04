const { json, standardResponse } = require("/opt/nodejs/utils/response");

exports.handler = async (event) => {
  const userId = event?.pathParameters?.userId || null;

  return json(
    200,
    standardResponse({
      success: true,
      code: "USERS_STREAKS_GET_OK",
      message: "User streaks fetched",
      data: {
        userId,
        streaks: [],
      },
      meta: { requestId: event?.requestContext?.requestId },
    }),
  );
};
