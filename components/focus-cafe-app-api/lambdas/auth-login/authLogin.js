const { json, standardResponse } = require("/opt/nodejs/utils/response");

exports.handler = async (event) => {
  const body = event?.body ? JSON.parse(event.body) : {};

  return json(
    200,
    standardResponse({
      success: true,
      code: "AUTH_LOGIN_OK",
      message: "Login endpoint reached",
      data: {
        email: body.email || null,
      },
      meta: {
        requestId: event?.requestContext?.requestId,
      },
    }),
  );
};
