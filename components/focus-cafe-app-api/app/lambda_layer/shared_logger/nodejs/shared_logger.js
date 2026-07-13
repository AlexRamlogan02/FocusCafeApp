function log(level, service, message, context = {}) {
  const payload = {
    level,
    service,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  console.log(JSON.stringify(payload));
}

function emitMetric(namespace, service, metricName, value, unit = "Count", dimensions = {}) {
  const now = Date.now();
  const dimensionKeys = Object.keys(dimensions);

  const metricLog = {
    _aws: {
      Timestamp: now,
      CloudWatchMetrics: [
        {
          Namespace: namespace,
          Dimensions: [["service", ...dimensionKeys]],
          Metrics: [{ Name: metricName, Unit: unit }],
        },
      ],
    },
    service,
    [metricName]: value,
    ...dimensions,
  };

  console.log(JSON.stringify(metricLog));
}

function createLogger(serviceName = process.env.SERVICE_NAME || "unknown-service") {
  const namespace = process.env.METRICS_NAMESPACE || "focus-cafe-api";

  return {
    info: (message, context = {}) => log("info", serviceName, message, context),
    error: (message, context = {}) => log("error", serviceName, message, context),
    debug: (message, context = {}) => log("debug", serviceName, message, context),
    metric: (metricName, value, unit = "Count", dimensions = {}) => {
      emitMetric(namespace, serviceName, metricName, value, unit, dimensions);
    },
  };
}

module.exports = {
  createLogger,
};