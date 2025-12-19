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
            sx={{ borderRadius: "8px", textTransform: "none" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"  // 1. เปลี่ยนเป็นแบบทึบเพื่อให้เด่น
          color="primary"      // 2. เปลี่ยนเป็นสีหลัก (น้ำเงิน) แทนสีแดง
          onClick={handleConfirm}
          disabled={!inputValue.trim() || loading}
          sx={{ 
            borderRadius: "8px", 
            textTransform: "none", 
            fontWeight: "bold",
            boxShadow: "none" // อันนี้ใส่ไว้ได้ถ้าใช้ contained เพื่อลบเงาให้ดูแบน (Flat)
          }}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}