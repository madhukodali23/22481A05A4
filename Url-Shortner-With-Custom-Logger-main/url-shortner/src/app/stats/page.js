"use client";

import { Box, Typography, Paper } from "@mui/material";
import StatsTable from "../../components/StatsTable";

export default function Stats() {
  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          URL Statistics
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          align="center"
          sx={{ mb: 4 }}
        >
          View all your shortened URLs and their statistics
        </Typography>
        <StatsTable />
      </Paper>
    </Box>
  );
}
