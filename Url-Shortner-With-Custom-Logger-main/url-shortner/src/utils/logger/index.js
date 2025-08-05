
import { Log } from "logging-middleware";

const LOG_CATEGORIES = {
  URL_MANAGEMENT: "url management",
  FORM_HANDLING: "form handling",
  NAVIGATION: "navigation",
  ERROR_HANDLING: "error handling",
  STATE_MANAGEMENT: "state management",
};

const logger = {
  /**
   * Debug level logging
   * @param {string} pkg - The package/module name
   * @param {string} message - The log message
   * @param {Object} details - Additional details to include in the log
   */
  debug: (pkg, message, details = {}) => {
    const enhancedMessage = details
      ? `${message} - ${JSON.stringify(details)}`
      : message;
    Log("frontend", "debug", pkg, enhancedMessage);
  },

  /**
   * Info level logging
   * @param {string} pkg - The package/module name
   * @param {string} message - The log message
   * @param {Object} details - Additional details to include in the log
   */
  info: (pkg, message, details = {}) => {
    const enhancedMessage = details
      ? `${message} - ${JSON.stringify(details)}`
      : message;
    Log("frontend", "info", pkg, enhancedMessage);
  },

  /**
   * Warning level logging
   * @param {string} pkg - The package/module name
   * @param {string} message - The log message
   * @param {Object} details - Additional details to include in the log
   */
  warn: (pkg, message, details = {}) => {
    const enhancedMessage = details
      ? `${message} - ${JSON.stringify(details)}`
      : message;
    Log("frontend", "warn", pkg, enhancedMessage);
  },

  /**
   * Error level logging
   * @param {string} pkg - The package/module name
   * @param {string} message - The log message
   * @param {Object|Error} error - Error object or details
   */
  error: (pkg, message, error = {}) => {
    let enhancedMessage = message;

    // If error is an Error object, extract useful information
    if (error instanceof Error) {
      enhancedMessage = `${message} - ${error.message}${
        error.stack ? ` | Stack: ${error.stack}` : ""
      }`;
    } else if (typeof error === "object" && error !== null) {
      enhancedMessage = `${message} - ${JSON.stringify(error)}`;
    }

    Log("frontend", "error", pkg, enhancedMessage);
  },

  /**
   * Fatal level logging
   * @param {string} pkg - The package/module name
   * @param {string} message - The log message
   * @param {Object|Error} error - Error object or details
   */
  fatal: (pkg, message, error = {}) => {
    let enhancedMessage = message;

    // If error is an Error object, extract useful information
    if (error instanceof Error) {
      enhancedMessage = `${message} - ${error.message}${
        error.stack ? ` | Stack: ${error.stack}` : ""
      }`;
    } else if (typeof error === "object" && error !== null) {
      enhancedMessage = `${message} - ${JSON.stringify(error)}`;
    }

    Log("frontend", "fatal", pkg, enhancedMessage);
  },
};

export { logger, LOG_CATEGORIES };
