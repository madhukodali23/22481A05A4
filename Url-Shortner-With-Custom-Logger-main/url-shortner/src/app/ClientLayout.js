"use client";

import { UrlProvider } from "../context/UrlContext";
import Navigation from "../components/Navigation";
import { Container } from "@mui/material";
import { useEffect } from "react";
import { logger, LOG_CATEGORIES } from "../utils/logger";

export default function ClientLayout({ children }) {
  // Initialize logging when the app starts
  useEffect(() => {
    logger.info("page", "Application initialized", {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });

    // Log when the component unmounts (app closes)
    return () => {
      logger.info("page", "Application terminated", {
        timestamp: new Date().toISOString(),
      });
    };
  }, []);

  return (
    <UrlProvider>
      <Navigation />
      <Container sx={{ pt: 4, pb: 8 }}>{children}</Container>
    </UrlProvider>
  );
}
