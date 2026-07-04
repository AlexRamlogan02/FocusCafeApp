const { json, standardResponse } = require("/opt/nodejs/utils/response");

exports.handler = async (event) => {
  const userId = event?.pathParameters?.userId || null;

  return json(
    200,
    standardResponse({
      success: true,
      code: "USERS_HISTORY_GET_OK",
      message: "User history fetched",
      data: {
        userId,
        history: [],
      },
      meta: { requestId: event?.requestContext?.requestId },
    }),
  );
};
