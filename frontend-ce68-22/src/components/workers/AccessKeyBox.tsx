"use client";

import { useState } from "react";
import { 
  Box, 
  Typography, 
  IconButton, 
  Tooltip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  CircularProgress
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Skeleton from "@mui/material/Skeleton";

import EyeIcon from "../icon/EyeIcon";
import CloseEyeIcon from "../icon/CloseEyeIcon";
import { useAccessKey } from "@/src/hooks/use-accessKey";
import { accessKeyService } from "@/src/services/accessKey.service";

interface AccessKeyBoxProps {
  accessKeyId: number;
  onRevokeSuccess: () => void;
}

export function AccessKeyBox({ accessKeyId, onRevokeSuccess }: AccessKeyBoxProps)
{
    const [showKey, setShowKey] = useState(false);
    const [copied, setCopied] = useState(false);

    // สำหรับ modal ยืนยันการลบ
    const [openConfirm, setOpenConfirm] = useState(false);
    const [isRevoking, setIsRevoking] = useState(false);

    const { data, isLoading } = useAccessKey(accessKeyId);

    // ฟังก์ชันสลับสถานะตา (เปิด/ปิด)
    const toggleVisibility = () => {
        setShowKey(!showKey);
    };

    // ฟังก์ชันแถม: กด Copy
    const handleCopy = () => {
        const accessKey = data?.key;

        if (accessKey)
        {
            navigator.clipboard.writeText(accessKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // รีเซ็ตสถานะหลัง 2 วิ
        } 
    };
    
    // ฟังก์ชันลบ
    const handleRevokeClick = () => {
        setOpenConfirm(true);
    };

    // ฟังก์ชันยืนยันลบจริง (กด Confirm ใน Modal)
    const handleConfirmRevoke = async () => {
        setIsRevoking(true);
        try {
            // 1. เรียก API ลบ (สมมติว่ามี service นี้)
            await accessKeyService.revoke(accessKeyId);
            
            // 2. ปิด Modal
            setOpenConfirm(false);

            // 3. แจ้ง Parent ว่าลบเสร็จแล้ว (เพื่อให้ Parent รีเฟรชหน้ากลับไปเป็นปุ่ม Generate)
            onRevokeSuccess();

        } catch (error) {
            console.error("Failed to revoke key", error);
            alert("Failed to revoke key");
        } finally {
            setIsRevoking(false);
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#272D31", 
                    borderRadius: "8px",
                    padding: "12px 16px",
                    width: "100%", // หรือกำหนด width: "400px" ตามต้องการ
                    maxWidth: "600px", 
                    height: "40px"
                }}
            >
                {/* ส่วนแสดงข้อความ Key */}
                <Typography
                    variant="body1"
                    sx={{
                        color: "#E6F0E6",
                        letterSpacing: showKey ? "0.5px" : "1px", 
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                        marginRight: 2
                    }}
                >
                    {isLoading ? (
                        <Skeleton sx={{ bgcolor: 'grey.800' }} width="80%" />
                    ) : (
                        showKey ? (data?.key || "ไม่พบข้อมูล Key") : "••••••••••••••••••••••••••••••••"
                    )}
                    
                </Typography>

                {/* ส่วนปุ่ม Action ด้านขวา */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                            
                    {/* ปุ่มเปิด/ปิดตา */}
                    <Tooltip title={showKey ? "Hide Key" : "Show Key"}>
                        <IconButton 
                            onClick={toggleVisibility} 
                            disabled={isLoading || !data?.key}
                            sx={{ color: "#a0a0a0", "&:hover": { color: "#8FFF9C" } }}
                        >
                            {showKey ? <CloseEyeIcon/> : <EyeIcon/>}
                        </IconButton>
                    </Tooltip>

                    {/* ปุ่ม Copy */}
                    <Tooltip title={copied ? "Copied!" : "Copy Key"}>
                        <IconButton 
                            onClick={handleCopy}
                            sx={{ color: "#a0a0a0", "&:hover": { color: "#8FFF9C" } }}
                        >
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* --- ปุ่ม Revoke (ถังขยะ) --- */}
                    <Tooltip title="Revoke Key">
                        <IconButton 
                            onClick={handleRevokeClick}
                            disabled={isLoading}
                            sx={{ 
                                color: "#a0a0a0", 
                                "&:hover": { color: "#ef5350" } // สีแดงตอน Hover
                            }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            {/* --- Dialog ยืนยันการลบ --- */}
            <Dialog
                open={openConfirm}
                onClose={() => !isRevoking && setOpenConfirm(false)}
                PaperProps={{
                    sx: { backgroundColor: "#1A2023", color: "#E6F0E6", borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ color: "#ef5350", fontWeight: "bold" }}>
                    Revoke Access Key?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: "#b0b0b0" }}>
                        Are you sure you want to revoke this access key? 
                        <br/>
                        This action cannot be undone, and the worker will lose access immediately.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button 
                        onClick={() => setOpenConfirm(false)} 
                        disabled={isRevoking}
                        sx={{ color: "#a0a0a0" }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmRevoke} 
                        variant="contained" 
                        color="error"
                        disabled={isRevoking}
                        autoFocus
                    >
                        {isRevoking ? <CircularProgress size={24} color="inherit"/> : "Revoke"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}