"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logger } from "../utils/logger";
import { useEffect } from "react";

const Navigation = () => {
  const pathname = usePathname();

  // Log page navigation
  useEffect(() => {
    logger.info("navigation", "Page navigation", { path: pathname });
  }, [pathname]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={Link}
            href="/"
            onClick={() =>
              logger.debug("component", "Navigation button clicked", {
                destination: "home",
              })
            }
            sx={{
              fontWeight: pathname === "/" ? "bold" : "normal",
              textDecoration: pathname === "/" ? "underline" : "none",
            }}
          >
            Shorten URLs
          </Button>
          <Button
            color="inherit"
            component={Link}
            href="/stats"
            onClick={() =>
              logger.debug("component", "Navigation button clicked", {
                destination: "stats",
              })
            }
            sx={{
              fontWeight: pathname === "/stats" ? "bold" : "normal",
              textDecoration: pathname === "/stats" ? "underline" : "none",
            }}
          >
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
