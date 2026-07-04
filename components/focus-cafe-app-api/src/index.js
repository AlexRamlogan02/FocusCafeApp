exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "PomoBrew API is live",
      path: event?.path || null,
      method: event?.httpMethod || null
    })
  };
};
