"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface GenericDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityName: string;      // ชื่อของสิ่งที่จะลบ (เช่น "CECompany", "admin@test.com")
  entityType?: string;     // ประเภท (เช่น "Project", "User", "Asset") - default เป็น "Item"
  loading?: boolean;
  description?: React.ReactNode; // (Optional) เผื่ออยาก Custom ข้อความเตือนเอง
}

export function GenericDeleteModal({
  open,
  onClose,
  onConfirm,
  entityName,
  entityType = "Item",
  loading = false,
  description,
}: GenericDeleteModalProps) {
  const [inputValue, setInputValue] = useState("");

  // เช็คว่าพิมพ์ตรงกับชื่อไหม
  const isMatch = inputValue === entityName;

  // Reset ค่าเมื่อเปิด Modal ใหม่
  useEffect(() => {
    if (open) {
      setInputValue("");
    }
  }, [open]);

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
        <WarningAmberIcon />
        Delete {entityType}
      </DialogTitle>

      <DialogContent>
        {/* ส่วนข้อความเตือน */}
        <DialogContentText sx={{ mb: 2, color: 'text.secondary' }}>
            {description ? description : (
                <span>
                    This action <strong>cannot</strong> be undone. This will permanently delete the 
                    {` ${entityType.toLowerCase()} `} 
                    <strong style={{ color: '#000' }}>{entityName}</strong> and remove all associated data.
                </span>
            )}
        </DialogContentText>

        {/* ส่วนบอกให้พิมพ์ชื่อ */}
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          Please type <strong style={{ userSelect: "all" }}>{entityName}</strong> to confirm.
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={entityName}
          disabled={loading}
          autoComplete="off"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&.Mui-focused fieldset": {
                borderColor: "#d32f2f", // สีแดงเมื่อ Focus
              },
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
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={!isMatch || loading}
          sx={{ 
            borderRadius: "8px", 
            textTransform: "none", 
            fontWeight: "bold",
            boxShadow: "none"
          }}
        >
          {loading ? "Deleting..." : `Delete this ${entityType.toLowerCase()}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}