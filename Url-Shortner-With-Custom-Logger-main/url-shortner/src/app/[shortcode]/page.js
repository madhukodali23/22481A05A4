"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import { useUrlContext } from "../../context/UrlContext";
import { use } from "react";
import Link from "next/link";
import { logger, LOG_CATEGORIES } from "../../utils/logger";

export default function ShortcodeRedirect({ params }) {
  // Use React.use() to properly unwrap the params
  const unwrappedParams = use(params);
  const shortcode = unwrappedParams.shortcode;
  const router = useRouter();
  const { getUrlByShortcode, incrementClickCount, isUrlExpired } =
    useUrlContext();

  // Add state to track loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to handle redirection logic
    const handleRedirect = () => {
      setIsLoading(true);
      setError(null);

      logger.info("page", "Processing URL redirection", { shortcode });

      try {
        // Slight delay to ensure context is loaded
        setTimeout(() => {
          // Try to get URL by shortcode
          const url = getUrlByShortcode(shortcode);

          if (!url) {
            // Shortcode not found
            const errorMsg = `Shortcode not found: ${shortcode}`;
            logger.warn("page", errorMsg);
            console.error(errorMsg);
            setError({
              type: "not-found",
              message: `The URL with shortcode "${shortcode}" doesn't exist.`,
            });
            setIsLoading(false);
            return;
          }

          if (isUrlExpired(url)) {
            // URL has expired
            const errorMsg = `URL with shortcode ${shortcode} has expired`;
            logger.warn("page", errorMsg, {
              shortcode,
              originalUrl: url.originalUrl,
              expiryDate: url.expiryDate,
            });
            console.error(errorMsg);
            setError({
              type: "expired",
              message: `The URL with shortcode "${shortcode}" has expired.`,
            });
            setIsLoading(false);
            return;
          }

          // Increment click count
          incrementClickCount(shortcode);

          logger.info("page", "Redirecting to original URL", {
            shortcode,
            originalUrl: url.originalUrl,
          });

          // Redirect to the original URL
          window.location.href = url.originalUrl;
        }, 100); // Small delay to ensure state is loaded
      } catch (err) {
        logger.error("page", "Error during redirection", err);
        console.error("Error during redirection:", err);
        setError({
          type: "error",
          message: "An error occurred during redirection.",
        });
        setIsLoading(false);
      }
    };

    // Start redirection process
    handleRedirect();
  }, [shortcode, getUrlByShortcode, incrementClickCount, isUrlExpired]);

  // Get URL for rendering purposes
  const url = getUrlByShortcode(shortcode);

  // Show error states
  if (error) {
    return (
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error.type === "not-found"
              ? "Short URL Not Found"
              : error.type === "expired"
              ? "Short URL Expired"
              : "Error"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {error.message}
          </Typography>
          <Button variant="contained" component={Link} href="/" sx={{ mr: 2 }}>
            Create New URL
          </Button>
          <Button variant="outlined" component={Link} href="/stats">
            View Stats
          </Button>
        </Paper>
      </Box>
    );
  }

  // Show loading state
  if (isLoading || !url) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Redirecting...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Looking up short URL: {shortcode}
        </Typography>
      </Box>
    );
  }

  // Show URL info while redirecting (this might only appear briefly)
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 8,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Redirecting...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        You are being redirected to {url.originalUrl}
      </Typography>
    </Box>
  );
}
