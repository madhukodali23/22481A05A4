import axios from "axios";

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";
const API_KEY = process.env.LOGGING_API_KEY || process.env.API_KEY;

const ALLOWED_VALUES = {
  stack: ["backend", "frontend"],
  level: ["debug", "info", "warn", "error", "fatal"],
  package: {
    backend: [
      "cache",
      "controller",
      "cron job",
      "db",
      "domain",
      "handler",
      "repository",
      "route",
      "service",
    ],
    frontend: ["api", "component", "hook", "page", "state", "style"],
    both: ["auth", "config", "middleware", "utils"],
  },
};

/**
 * Validates the log parameters against allowed values
 * @param {string} stack - 'backend' or 'frontend'
 * @param {string} level - log level ('debug', 'info', 'warn', 'error', 'fatal')
 * @param {string} pkg - the package/module name
 * @returns {boolean} - true if validation passes, false otherwise
 */
function validateParams(stack, level, pkg) {
  if (!ALLOWED_VALUES.stack.includes(stack)) {
    console.error(
      `Invalid stack value: ${stack}. Allowed values: ${ALLOWED_VALUES.stack.join(
        ", "
      )}`
    );
    return false;
  }

  if (!ALLOWED_VALUES.level.includes(level)) {
    console.error(
      `Invalid level value: ${level}. Allowed values: ${ALLOWED_VALUES.level.join(
        ", "
      )}`
    );
    return false;
  }

  const validPackages = [
    ...ALLOWED_VALUES.package.both,
    ...(stack === "backend" ? ALLOWED_VALUES.package.backend : []),
    ...(stack === "frontend" ? ALLOWED_VALUES.package.frontend : []),
  ];

  if (!validPackages.includes(pkg)) {
    console.error(
      `Invalid package value: ${pkg} for stack: ${stack}. Allowed values: ${validPackages.join(
        ", "
      )}`
    );
    return false;
  }
  return true;
}

/**
 * Sends a log entry to the logging server
 * @param {string} stack - 'backend' or 'frontend'
 * @param {string} level - log level ('debug', 'info', 'warn', 'error', 'fatal')
 * @param {string} pkg - the package/module name
 * @param {string} message - the log message
 * @returns {Promise<object|null>} - response from the logging server or null if validation fails
 */
async function Log(stack, level, pkg, message) {
  // Convert inputs to lowercase to ensure they match allowed values
  stack = stack.toLowerCase();
  level = level.toLowerCase();
  pkg = pkg.toLowerCase();

  // Validate parameters
  if (!validateParams(stack, level, pkg)) {
    return null;
  }

  // Prepare log data
  const logData = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    // Prepare headers
    const headers = {
      "Content-Type": "application/json",
    };

    // Add authorization header if API key is available
    if (API_KEY) {
      headers["Authorization"] = `Bearer ${API_KEY}`;
    }

    // Send log to the API
    const response = await axios.post(LOG_API_URL, logData, { headers });
    return response.data;
  } catch (error) {
    // Handle API errors but don't throw (to avoid crashing the app)
    if (error.response && error.response.status === 401) {
      console.warn(
        "Logging API authentication failed. Please set LOGGING_API_KEY environment variable."
      );
      console.warn("Log data:", JSON.stringify(logData, null, 2));
      return null;
    }

    console.error("Failed to send log:", error.message);
    if (error && error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    return null;
  }
}

export { Log };