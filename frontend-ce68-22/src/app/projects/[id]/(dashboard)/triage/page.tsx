"use client";

import { Box, Typography } from "@mui/material";
import { BugReport as BugIcon } from "@mui/icons-material";

export default function TriageDefaultPage() {
  return (
    <Box 
      sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        bgcolor: "#161B1F",
        borderRadius: "20px",
        border: "1px solid #404F57",
        p: 4,
        textAlign: "center",
        minHeight: "600px"
      }}
    >
      <Box 
        sx={{ 
          bgcolor: "rgba(143, 255, 156, 0.05)", 
          p: 3, 
          borderRadius: "50%", 
          mb: 2,
          border: "1px solid rgba(143, 255, 156, 0.1)"
        }}
      >
        <BugIcon sx={{ fontSize: 48, color: "#8FFF9C", opacity: 0.5 }} />
      </Box>
      <Typography variant="h6" sx={{ color: "#FBFBFB", fontWeight: 700, mb: 1 }}>
        Select an issue to triage
      </Typography>
      <Typography variant="body2" sx={{ color: "#9AA6A8", maxWidth: "300px" }}>
        Choose a vulnerability from the list on the left to review technical details and remediation steps.
      </Typography>
    </Box>
  );
}