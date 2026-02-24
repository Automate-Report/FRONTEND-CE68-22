"use client";

import { useState } from "react";
import { useAccessKey } from "@/src/hooks/use-accessKey";

import { Box, Typography, Stack, Tooltip, IconButton, Button, CircularProgress } from "@mui/material";
import { 
  Visibility as EyeOpenIcon, 
  VisibilityOff as EyeClosedIcon,
  ContentCopy as CopyIcon,
  Refresh as RevokeIcon,
  Check as CopiedIcon
} from "@mui/icons-material";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal"; // นำ Modal เดิมมาประยุกต์ใช้

interface WorkerAccessKeySectionProps {
  accessKeyId: number;
  workerName: string;
  onRevoke: () => Promise<void>; // รับ Function ที่เรียก API Re-create
  isLoading?: boolean;
}

export function WorkerAccessKeySection({ accessKeyId, onRevoke, isLoading = false, workerName }: WorkerAccessKeySectionProps) {

  const { data: accessKey, isError: isAccessKeyError } = useAccessKey(accessKeyId);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const handleCopy = () => {
    if (accessKey?.key) {
      navigator.clipboard.writeText(accessKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirmRevoke = async () => {
    setIsRevoking(true);
    try {
      await onRevoke();
      setRevokeModalOpen(false);
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <Box sx={{ mt: 5, pt: 4, borderTop: "1px solid #2D2F39" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography sx={{ color: "#9AA6A8", fontSize: "12px", fontWeight: 800, textTransform: "uppercase" }}>
          Worker Access Key
        </Typography>
        
        {/* ปุ่ม Revoke Key */}
        <Button
          size="small"
          startIcon={isRevoking ? <CircularProgress size={16} color="inherit" /> : <RevokeIcon />}
          onClick={() => setRevokeModalOpen(true)}
          sx={{ 
            color: "#FE3B46", 
            fontSize: "11px", 
            fontWeight: "bold",
            "&:hover": { bgcolor: "rgba(254, 59, 70, 0.1)" }
          }}
        >
          Revoke & Re-create
        </Button>
      </Stack>

      <Box sx={{ 
        display: "flex", alignItems: "center", bgcolor: "#0F1518", p: 2, borderRadius: "12px", 
        border: "1px dashed #404F57", justifyContent: "space-between", transition: "0.3s",
        "&:hover": { borderColor: "#8FFF9C" }
      }}>
        <Typography sx={{ 
            color: "#8FFF9C", 
            fontFamily: "monospace", 
            fontSize: "14px", 
            letterSpacing: 2,
            // filter: showKey ? "none" : "blur(4px)",
            transition: "filter 0.2s",
            userSelect: showKey ? "text" : "none"
        }}>
            {showKey ? (accessKey?.key || "wrk_live_xxxxxxxxxxxx") : "••••••••••••••••••••••••"}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Tooltip title={showKey ? "Hide" : "Show"}>
            <IconButton size="small" onClick={() => setShowKey(!showKey)} sx={{ color: "#9AA6A8", "&:hover": { color: "#8FFF9C" } }}>
              {showKey ? <EyeClosedIcon fontSize="small" /> : <EyeOpenIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title={copied ? "Copied!" : "Copy Key"}>
            <IconButton size="small" onClick={handleCopy} sx={{ color: copied ? "#8FFF9C" : "#9AA6A8", "&:hover": { color: "#8FFF9C" } }}>
              {copied ? <CopiedIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Typography sx={{ color: "#404F57", fontSize: "11px", mt: 1 }}>
        * Revoking the key will immediately disconnect any worker using the current key.
      </Typography>

      {/* Modal ยืนยันการ Revoke */}
      <GenericDeleteModal
        open={revokeModalOpen}
        onClose={() => setRevokeModalOpen(false)}
        onConfirm={handleConfirmRevoke}
        entityType="Access Key"
        entityName={workerName}
        loading={isRevoking}
        // ปรับแต่งข้อความปุ่มให้เข้ากับการ Revoke
      />
    </Box>
  );
}