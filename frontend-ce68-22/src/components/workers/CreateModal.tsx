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
      sx={{
        borderRedius: 3,
      }}
      
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        color: '#8FFF9C', 
        fontWeight: 'bold' ,
        backgroundColor: '#0B0F12'
        }}
      >
        Create Worker
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: '#0B0F12'
        }}
      >
        {/* ส่วนบอกให้พิมพ์ชื่อ */}
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 1.5 ,
            color: '#E6F0E6', 
          }}
        >
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
            // 1. จัดการตัว Input (สีตัวอักษร + Padding)
            "& .MuiInputBase-input": {
              color: "#E6F0E6",      // text-[#E6F0E6]
              padding: "8px 16px",   // py-2 (8px) px-4 (16px)
            },

            // 2. จัดการตัวกล่องและเส้นขอบ
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#1A2023", // bg-[#1A2023]
              borderRadius: "8px",        // rounded-lg

              // --- เส้นขอบปกติ (border border-[#2A3033]) ---
              "& fieldset": {
                borderColor: "#2A3033",
                borderWidth: "1px",
              },

              // --- เส้นขอบตอน Hover (ถ้าไม่ใส่ MUI จะปรับสีเอง) ---
              "&:hover fieldset": {
                borderColor: "#2A3033", // หรือปรับให้สว่างขึ้นนิดหน่อยก็ได้
              },

              // --- เส้นขอบตอน Focus (focus:border-[#8FFF9C]) ---
              "&.Mui-focused fieldset": {
                borderColor: "#8FFF9C", // สีเขียวสว่าง
              },
            },
            
            // (แถม) ปรับสี Label ตอนยังไม่พิมพ์ (Placeholder) ให้เข้ากับ Theme มืด
            "& .MuiInputLabel-root": {
              color: "#a0a0a0", 
              "&.Mui-focused": { color: "#8FFF9C" }
            }
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 , backgroundColor: '#0B0F12'}}>
        <Button 
          onClick={onClose} 
          disabled={loading} 
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
          variant="contained"  
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

            "&.Mui-disabled": {
              backgroundColor: "#272D31", 
              color: "#E6F0E6" ,         
              boxShadow: "none"
            }
          }}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}