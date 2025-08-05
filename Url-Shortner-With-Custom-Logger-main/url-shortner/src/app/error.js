"use client";

import { useEffect } from "react";
import { logger } from "../utils/logger";

export default function ErrorBoundary({ error }) {
  useEffect(() => {
    // Log uncaught errors
    logger.error("error", "Uncaught application error", error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <p>An unexpected error occurred. Our team has been notified.</p>
      <button onClick={() => (window.location.href = "/")}>
        Return to Home
      </button>
    </div>
  );
}
