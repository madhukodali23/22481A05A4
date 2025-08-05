"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Link as MuiLink,
  Button,
} from "@mui/material";
import { useUrlContext } from "../context/UrlContext";
import { formatDate } from "../utils/validators";
import Link from "next/link";
import { logger, LOG_CATEGORIES } from "../utils/logger";

const StatsTable = () => {
  const { shortenedUrls, isUrlExpired } = useUrlContext();
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (shortcode) => {
    const shortUrl = `${window.location.origin}/${shortcode}`;
    navigator.clipboard
      .writeText(shortUrl)
      .then(() => {
        logger.info("component", "Short URL copied to clipboard", {
          shortcode,
        });
        setCopied(shortcode);
        setTimeout(() => setCopied(null), 2000); 
      })
      .catch((err) => {
        logger.error("component", "Failed to copy URL to clipboard", err);
        console.error("Failed to copy URL to clipboard:", err);
      });
  };

  const sortedUrls = [...shortenedUrls].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (sortedUrls.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">No shortened URLs yet.</Typography>
        <Button component={Link} href="/" variant="contained" sx={{ mt: 2 }}>
          Create Short URLs
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        URL Statistics
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Original URL</TableCell>
              <TableCell>Short URL</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUrls.map((url) => {
              const expired = isUrlExpired(url);
              return (
                <TableRow
                  key={url.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 250,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={url.originalUrl} 
                    >
                      <MuiLink
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        {url.originalUrl}
                      </MuiLink>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {expired ? (
                        <Typography variant="body2">{url.shortcode}</Typography>
                      ) : (
                        <MuiLink
                          href={`/${url.shortcode}`}
                          component={Link}
                          underline="hover"
                          sx={{ mr: 1 }}
                        >
                          {url.shortcode}
                        </MuiLink>
                      )}
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => copyToClipboard(url.shortcode)}
                        sx={{ minWidth: "auto", p: 0.5 }}
                      >
                        {copied === url.shortcode ? "✓ Copied" : "Copy"}
                      </Button>
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(url.createdAt)}</TableCell>
                  <TableCell>{formatDate(url.expiryDate)}</TableCell>
                  <TableCell>{url.clicks}</TableCell>
                  <TableCell>
                    <Chip
                      label={expired ? "Expired" : "Active"}
                      color={expired ? "error" : "success"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StatsTable;
