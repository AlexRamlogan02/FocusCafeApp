const { json, standardResponse } = require("/opt/nodejs/utils/response");

exports.handler = async (event) => {
  const userId = event?.pathParameters?.userId || null;
  const body = event?.body ? JSON.parse(event.body) : {};

  return json(
    200,
    standardResponse({
      success: true,
      code: "USERS_STREAKS_POST_OK",
      message: "User streak saved",
      data: {
        userId,
        streak: body,
      },
      meta: { requestId: event?.requestContext?.requestId },
    }),
  );
};
