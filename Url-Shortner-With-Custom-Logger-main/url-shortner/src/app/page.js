import { Box, Typography, Paper } from "@mui/material";
import UrlForm from "../components/UrlForm";

export default function Home() {
  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          URL Shortener
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          align="center"
          sx={{ mb: 4 }}
        >
          Create up to 5 shortened URLs at once
        </Typography>
        <UrlForm />
      </Paper>
    </Box>
  );
}
