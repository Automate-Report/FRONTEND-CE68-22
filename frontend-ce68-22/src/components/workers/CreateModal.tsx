"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";


interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  loading?: boolean;
}

export function CreateWorkerModal({
  open,
  onClose,
  onConfirm,
  loading = false
}: CreateModalProps ) {
  const [inputValue, setInputValue] = useState("");


  // Reset ค่าเมื่อเปิด Modal ใหม่
  useEffect(() => {
    if (open) {
      setInputValue("");
    }
  }, [open]);

  const handleConfirm = () => {
    if (inputValue.trim()) {
      onConfirm(inputValue);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!loading ? onClose : undefined} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 } // ปรับความโค้งของ Modal
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d32f2f', fontWeight: 'bold' }}>
        Create Worker
      </DialogTitle>

      <DialogContent>
        {/* ส่วนบอกให้พิมพ์ชื่อ */}
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          Please enter a name for the new worker.
        </Typography>

        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          size="small"
          label="Worker Name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. MyWorker-01"
          disabled={loading}
          autoComplete="off"
          // เพิ่มให้กด Enter แล้ว Submit ได้เลย สะดวกกว่า
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue.trim()) {
              e.preventDefault();
              handleConfirm();
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={loading} 
          color="inherit"
          variant="outlined"
          sx={{
            px: 3,
            textTransform: "none",
            fontSize: 16,
            fontWeight: 600,
            borderColor: "#FE3B46",
            color: "#FE3B46",
            borderRadius: "10px",
            "&:hover": {
              borderColor: "#FE3B46",
              backgroundColor: "#FE3B46",
              color: "#FBFBFB"
            }
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"  // 1. เปลี่ยนเป็นแบบทึบเพื่อให้เด่น
          color="primary"      // 2. เปลี่ยนเป็นสีหลัก (น้ำเงิน) แทนสีแดง
          onClick={handleConfirm}
          disabled={!inputValue.trim() || loading}
          sx={{
            // Layout (flex items-center justify-center)
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5, // gap-3 (12px)

            // Colors (bg-[#8FFF9C] text-[#0B0F12])
            backgroundColor: "#8FFF9C",
            color: "#0B0F12",

            // Typography (text-[16px] font-semibold)
            fontSize: "16px",
            fontWeight: 600, // semibold
            textTransform: "none", // สำคัญ! ป้องกัน MUI แปลงเป็นตัวใหญ่หมด

            // Spacing (px-6 py-2)
            px: 3, // 24px (MUI default spacing 1 = 8px)
            py: 1, // 8px

            // Border & Shadow (rounded-lg shadow-sm)
            borderRadius: "8px", // rounded-lg
            boxShadow: "none",

            // Interaction (cursor-pointer hover:bg-[#AFFFB9])
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#AFFFB9",
              boxShadow: "none"
            },
          }}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}