"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import {
  isValidUrl,
  isValidShortcode,
  isValidValidity,
} from "../utils/validators";
import { useUrlContext } from "../context/UrlContext";
import { logger, LOG_CATEGORIES } from "../utils/logger";

const UrlForm = () => {
  // Initial URL input state
  const initialUrlInput = {
    originalUrl: "",
    validity: "",
    customShortcode: "",
  };

  const [urlInputs, setUrlInputs] = useState([initialUrlInput]);
  const [errors, setErrors] = useState([{}]);
  const [results, setResults] = useState([]);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { addShortenedUrl } = useUrlContext();

  // Handle adding a new URL input field (max 5)
  const handleAddUrlInput = () => {
    if (urlInputs.length < 5) {
      setUrlInputs([...urlInputs, initialUrlInput]);
      setErrors([...errors, {}]);
      logger.debug("component", "Added new URL input field", {
        totalFields: urlInputs.length + 1,
      });
    }
  };

  // Handle removing a URL input field
  const handleRemoveUrlInput = (indexToRemove) => {
    if (urlInputs.length > 1) {
      setUrlInputs(urlInputs.filter((_, index) => index !== indexToRemove));
      setErrors(errors.filter((_, index) => index !== indexToRemove));
      logger.debug("component", "Removed URL input field", {
        removedIndex: indexToRemove,
        remainingFields: urlInputs.length - 1,
      });
    }
  };

  const handleInputChange = (index, field, value) => {
    const newUrlInputs = [...urlInputs];
    newUrlInputs[index] = { ...newUrlInputs[index], [field]: value };
    setUrlInputs(newUrlInputs);

    const newErrors = [...errors];
    if (newErrors[index]) {
      delete newErrors[index][field];
      setErrors(newErrors);
    }

    logger.debug("component", "URL form field changed", { index, field });
  };

  const validateUrlInput = (input, index) => {
    const newErrors = { ...errors[index] };

    if (!input.originalUrl.trim()) {
      newErrors.originalUrl = "URL is required";
      logger.debug("component", "URL validation error", {
        index,
        error: "URL is required",
      });
    } else if (!isValidUrl(input.originalUrl)) {
      newErrors.originalUrl = "Please enter a valid URL";
      logger.debug("component", "URL validation error", {
        index,
        error: "Invalid URL format",
      });
    }

    if (input.customShortcode && !isValidShortcode(input.customShortcode)) {
      newErrors.customShortcode =
        "Shortcode must be 3-10 alphanumeric characters";
      logger.debug("component", "Shortcode validation error", {
        index,
        shortcode: input.customShortcode,
      });
    }

    if (!isValidValidity(input.validity)) {
      newErrors.validity = "Validity must be a positive integer";
      logger.debug("component", "Validity validation error", {
        index,
        validity: input.validity,
      });
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");
    setResults([]);

    logger.info("component", "URL form submission started", {
      inputCount: urlInputs.length,
    });

    const newErrors = urlInputs.map(validateUrlInput);
    setErrors(newErrors);

    const hasErrors = newErrors.some(
      (errObj) => Object.keys(errObj).length > 0
    );

    if (hasErrors) {
      logger.warn("component", "URL form validation failed", {
        errorCount: newErrors.filter((err) => Object.keys(err).length > 0)
          .length,
      });
      return;
    }

    try {
      const newResults = urlInputs.map((input) => {
        try {
          const validity = input.validity.trim()
            ? parseInt(input.validity, 10)
            : 30;
          const customShortcode = input.customShortcode.trim() || null;

          logger.info("component", "Processing URL shortening", {
            originalUrl: input.originalUrl,
            validity,
            hasCustomShortcode: !!customShortcode,
          });

          // Add shortened URL
          const result = addShortenedUrl(
            input.originalUrl,
            validity,
            customShortcode
          );

          logger.info("component", "URL shortened successfully", {
            originalUrl: input.originalUrl,
            shortcode: result.shortcode,
          });

          return {
            success: true,
            originalUrl: input.originalUrl,
            shortUrl: `${window.location.origin}/${result.shortcode}`,
            expiryDate: result.expiryDate,
          };
        } catch (error) {
          logger.error("component", "URL shortening failed", {
            originalUrl: input.originalUrl,
            error: error.message,
          });

          return {
            success: false,
            originalUrl: input.originalUrl,
            error: error.message,
          };
        }
      });

      setResults(newResults);

      // Check if all URLs were shortened successfully
      const allSuccess = newResults.every((result) => result.success);
      if (allSuccess) {
        logger.info("component", "All URLs shortened successfully", {
          count: newResults.length,
        });
        setSuccessMessage("All URLs shortened successfully!");
        // Reset form if all successful
        setUrlInputs([initialUrlInput]);
        setErrors([{}]);
      } else {
        logger.warn("component", "Some URLs failed to shorten", {
          total: newResults.length,
          successful: newResults.filter((r) => r.success).length,
          failed: newResults.filter((r) => !r.success).length,
        });
      }
    } catch (error) {
      const errorMessage =
        error.message || "An error occurred while shortening URLs";
      logger.error("component", "General error in URL form submission", error);
      setGeneralError(errorMessage);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%", maxWidth: "800px", mx: "auto" }}
    >
      {generalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {generalError}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* URL Input Fields */}
      {urlInputs.map((input, index) => (
        <Paper key={index} elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              URL {index + 1}
            </Typography>
            <TextField
              fullWidth
              label="Original URL*"
              value={input.originalUrl}
              onChange={(e) =>
                handleInputChange(index, "originalUrl", e.target.value)
              }
              error={!!errors[index]?.originalUrl}
              helperText={errors[index]?.originalUrl || ""}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Validity (minutes, default: 30)"
              placeholder="30"
              value={input.validity}
              onChange={(e) =>
                handleInputChange(index, "validity", e.target.value)
              }
              error={!!errors[index]?.validity}
              helperText={
                errors[index]?.validity ||
                "Leave empty for default (30 minutes)"
              }
              margin="normal"
              type="number"
            />
            <TextField
              fullWidth
              label="Custom Shortcode (optional)"
              value={input.customShortcode}
              onChange={(e) =>
                handleInputChange(index, "customShortcode", e.target.value)
              }
              error={!!errors[index]?.customShortcode}
              helperText={
                errors[index]?.customShortcode ||
                "Alphanumeric, 3-10 characters (optional)"
              }
              margin="normal"
            />
          </Box>

          {/* Remove URL Button */}
          {urlInputs.length > 1 && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveUrlInput(index)}
              sx={{ mt: 1 }}
            >
              Remove URL
            </Button>
          )}
        </Paper>
      ))}

      {/* Add URL Button */}
      {urlInputs.length < 5 && (
        <Button variant="outlined" onClick={handleAddUrlInput} sx={{ mb: 2 }}>
          Add Another URL ({urlInputs.length}/5)
        </Button>
      )}

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ mt: 2, mb: 4 }}
        fullWidth
      >
        Shorten URLs
      </Button>

      {/* Results Section */}
      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Results
          </Typography>
          {results.map((result, index) => (
            <Paper key={index} elevation={2} sx={{ p: 3, mb: 2 }}>
              {result.success ? (
                <>
                  <Typography variant="body1" gutterBottom>
                    <strong>Original URL:</strong> {result.originalUrl}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Short URL:</strong>{" "}
                    <a href={result.shortUrl} target="_blank" rel="noreferrer">
                      {result.shortUrl}
                    </a>
                  </Typography>
                  <Typography variant="body1">
                    <strong>Expires at:</strong>{" "}
                    {new Date(result.expiryDate).toLocaleString()}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1" gutterBottom>
                    <strong>Original URL:</strong> {result.originalUrl}
                  </Typography>
                  <Alert severity="error">Error: {result.error}</Alert>
                </>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UrlForm;
