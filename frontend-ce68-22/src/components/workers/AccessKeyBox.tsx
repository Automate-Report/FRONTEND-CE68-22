"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Skeleton from "@mui/material/Skeleton";

import EyeIcon from "../icon/EyeIcon";
import CloseEyeIcon from "../icon/CloseEyeIcon";
import { useAccessKey } from "@/src/hooks/use-accessKey";

interface AccessKeyBoxProps {
  accessKeyId: number;
}

export function AccessKeyBox({ accessKeyId }: AccessKeyBoxProps)
{
    const [showKey, setShowKey] = useState(false);
    const [copied, setCopied] = useState(false);

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

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#272D31", 
                borderRadius: "8px",
                padding: "12px 16px",
                width: "100%", // หรือกำหนด width: "400px" ตามต้องการ
                maxWidth: "580px" 
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
                        size="small"
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
                        size="small"
                        sx={{ color: "#a0a0a0", "&:hover": { color: "#8FFF9C" } }}
                    >
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}