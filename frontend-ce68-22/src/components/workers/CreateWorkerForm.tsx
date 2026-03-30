"use client";

import { useState } from "react";
import { TextField, Button, Typography, Box, Paper, Divider } from "@mui/material";
import { useRouter } from "next/navigation";

export interface CreateWorkerPayload {
  name: string;
  threads: number;
}

export function CreateWorkerForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [threads, setThreads] = useState<number | string>(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !threads) return;

    setLoading(true);
    // TODO: Connect to your FastAPI Backend (e.g., POST /workers)
    
    // หลังจากสร้างเสร็จ ให้กลับไปหน้าหลักของ Worker
    // router.push("/workers");
    setLoading(false);
  };

  const textFieldStyle = {
    mb: 3,
    "& .MuiInputBase-input": { 
      color: "#E6F0E6", 
      padding: "12px 16px" 
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#1A2023",
      borderRadius: "8px",
      "& fieldset": { borderColor: "#2A3033", borderWidth: "1px" },
      "&:hover fieldset": { borderColor: "#2A3033" },
      "&.Mui-focused fieldset": { borderColor: "#8FFF9C" },
    },
    "& .MuiInputLabel-root": {
      color: "#a0a0a0",
      "&.Mui-focused": { color: "#8FFF9C" }
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: { xs: 3, md: 5 }, 
        backgroundColor: '#0B0F12', 
        borderRadius: "16px", 
        border: '1px solid #1A2023',
        maxWidth: 700,
        mx: 'auto' 
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#8FFF9C', fontWeight: 'bold', mb: 1 }}>
          Create New Worker
        </Typography>
        <Typography variant="body2" sx={{ color: '#a0a0a0' }}>
          Assign a name and resources for your scanning agent.
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#1A2023', mb: 4 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Worker Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. MyScanner-Node-01"
          disabled={loading}
          autoComplete="off"
          sx={textFieldStyle}
        />

        <TextField
          fullWidth
          type="number"
          label="Threads"
          value={threads}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '' || Number(val) >= 1) setThreads(val);
          }}
          inputProps={{ min: 1 }}
          disabled={loading}
          sx={textFieldStyle}
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            disabled={loading}
            sx={{
              px: 4,
              py: 1.2,
              borderColor: "#FE3B46",
              color: "#FE3B46",
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: "10px",
              "&:hover": { 
                borderColor: "#FE3B46", 
                backgroundColor: "rgba(254, 59, 70, 0.1)" 
              }
            }}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            disabled={!name.trim() || !threads || loading}
            sx={{
              px: 4,
              py: 1.2,
              backgroundColor: "#8FFF9C",
              color: "#0B0F12",
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: "10px",
              "&:hover": { backgroundColor: "#AFFFB9" },
              "&.Mui-disabled": { 
                backgroundColor: "#272D31", 
                color: "#E6F0E6" 
              }
            }}
          >
            {loading ? "Creating..." : "Confirm Create"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}