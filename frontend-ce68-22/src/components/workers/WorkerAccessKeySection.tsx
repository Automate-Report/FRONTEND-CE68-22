"use client";

import { useState } from "react";
import { useAccessKey } from "@/src/hooks/use-accessKey";

import { Box, Typography, Stack, Tooltip, IconButton, Button, CircularProgress } from "@mui/material";
import {
  Visibility as EyeOpenIcon,
  VisibilityOff as EyeClosedIcon,
  ContentCopy as CopyIcon,
  Refresh as RevokeIcon,
  Check as CopiedIcon,
  KeyRounded
} from "@mui/icons-material";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal"; // นำ Modal เดิมมาประยุกต์ใช้
import { RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";

interface WorkerAccessKeySectionProps {
  accessKeyId: number;
  workerName: string;
  onRevoke: () => Promise<void>; // รับ Function ที่เรียก API Re-create
  isLoading?: boolean;
  role?: string; // เพิ่ม prop สำหรับ role ของผู้ใช้
}

export function WorkerAccessKeySection({ accessKeyId, onRevoke, isLoading = false, workerName, role }: WorkerAccessKeySectionProps) {

  const { data: accessKey, isError: isAccessKeyError } = useAccessKey(accessKeyId);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const isDeveloper = role === "developer"; // ตรวจสอบว่าเป็น developer หรือไม่

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
    <Box sx={{ mt: 4, pt: 2, borderTop: "2px solid #2D2F39" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <div className="flex flex-row gap-3 items-center ml-3">
          <KeyRounded sx={{ color: "#8FFF9C", fontSize: 20 }} />
          <Typography sx={{ color: "#E6F0E6", fontWeight: "bold" }}>
            Worker Access Key
          </Typography>
        </div>

        {/* ปุ่ม Revoke Key */}
        {!isDeveloper && (
          <button className="flex items-center font-semibold h-[32px] gap-2 px-5 py-4 text-sm text-[#FE3B46] border-[1px] border-[#FE3B46] rounded-xl hover:bg-[#FE3B46] hover:text-white cursor-pointer transition"
            onClick={() => setRevokeModalOpen(true)}>
            Revoke & Re-create
            <RevokeIcon sx={{ fontSize: 18 }} />
          </button>
        )}

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