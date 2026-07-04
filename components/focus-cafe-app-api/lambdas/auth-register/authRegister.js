const { json, standardResponse } = require("/opt/nodejs/utils/response");

exports.handler = async (event) => {
  const body = event?.body ? JSON.parse(event.body) : {};

  return json(
    200,
    standardResponse({
      success: true,
      code: "AUTH_REGISTER_OK",
      message: "Register endpoint reached",
      data: {
        email: body.email || null,
      },
      meta: {
        requestId: event?.requestContext?.requestId,
      },
    }),
  );
};
