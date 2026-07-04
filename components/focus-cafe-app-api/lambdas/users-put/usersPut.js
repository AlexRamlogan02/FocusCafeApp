const { json, standardResponse } = require("/opt/nodejs/utils/response");

exports.handler = async (event) => {
  const userId = event?.pathParameters?.userId || null;
  const body = event?.body ? JSON.parse(event.body) : {};

  return json(
    200,
    standardResponse({
      success: true,
      code: "USERS_PUT_OK",
      message: "User profile updated",
      data: {
        userId,
        update: body,
      },
      meta: { requestId: event?.requestContext?.requestId },
    }),
  );
};
