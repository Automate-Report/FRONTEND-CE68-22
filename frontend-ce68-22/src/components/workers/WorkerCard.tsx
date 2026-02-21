"use client";

import { Box, Typography, Stack, IconButton, LinearProgress, Tooltip } from "@mui/material";
import { 
  Engineering as WorkerIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Download as DownloadIcon,
  VpnKey as KeyIcon,
  Dns as HostIcon
} from "@mui/icons-material";
import { WORKER_STATUS_MAP } from "@/src/constants/worker-status";
import { Worker } from "@/src/types/worker";

interface WorkerCardProps {
  worker: Worker;
  canManage: boolean;
  onEdit: (e: React.MouseEvent) => void;         // เพิ่ม e
  onDelete: (e: React.MouseEvent, worker: Worker) => void; // เพิ่ม e และเปลี่ยนเป็น Worker type
  onDownload: (e: React.MouseEvent) => void;     // เพิ่ม e
}

export function WorkerCard({ worker, canManage, onEdit, onDelete, onDownload }: WorkerCardProps) {
  // ดึง Config สีจาก WORKER_STATUS_MAP เหมือนในตาราง
  const statusConfig = WORKER_STATUS_MAP[worker.status] || WORKER_STATUS_MAP.unknown;
  
  // ปรับตัวแปรให้ตรงกับข้อมูลในตาราง
  const currentLoad = worker.current_load ?? 0;
  const maxThread = worker.thread_number ?? 1;
  const loadPercentage = (currentLoad / maxThread) * 100;

  return (
    <Box sx={{ 
      bgcolor: "#1E2429", 
      borderRadius: "20px", 
      border: "1px solid #404F57", 
      p: 3,
      transition: "0.3s",
      "&:hover": { borderColor: "#8FFF9C", transform: "translateY(-4px)" }
    }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        {/* Icon ฝั่งซ้าย - ใช้สีหลักของระบบ */}
        <Box sx={{ 
          p: 1.5, 
          bgcolor: "rgba(143, 255, 156, 0.1)", 
          borderRadius: "12px",
          color: "#8FFF9C"
        }}>
          <WorkerIcon sx={{ fontSize: 32 }} />
        </Box>

        {/* Content หลัก */}
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
            {/* ชื่อ Worker */}
            <Typography variant="h6" sx={{ color: "#FBFBFB", fontWeight: "bold", lineHeight: 1 }}>
                {worker.name}
            </Typography>
            
            {/* Status Badge - แสดงในบรรทัดเดียวกัน */}
            <div className={`inline-block whitespace-nowrap text-[12px] font-semibold px-2.5 py-0.5 rounded-lg ${statusConfig.style}`}>
                {statusConfig.label}
            </div>
            </Box>

            {/* Actions (เฉพาะ Owner) */}
            {canManage && (
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Download Config"><IconButton size="small" onClick={() => onDownload(worker)} sx={{ color: "#8FFF9C" }}><DownloadIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Edit"><IconButton size="small" onClick={() => onEdit(worker)} sx={{ color: "#9AA6A8" }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Delete"><IconButton size="small" onClick={() => onDelete(worker)} sx={{ color: "#DD6E6E" }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
              </Stack>
            )}
          </Stack>

          {/* ข้อมูล Hostname และ Load */}
          <Stack spacing={1} sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ color: "#9AA6A8", display: "flex", alignItems: "center", gap: 1 }}>
              <HostIcon sx={{ fontSize: 16 }} /> {worker.hostname ?? "No Hostname"}
            </Typography>
            
            <Box>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" sx={{ color: "#FBFBFB", fontWeight: "bold" }}>
                  Current Load: {currentLoad}/{maxThread}
                </Typography>
                <Typography variant="caption" sx={{ color: "#9AA6A8" }}>
                  {Math.round(loadPercentage)}%
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={loadPercentage} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3, 
                  bgcolor: "#0F1518",
                  "& .MuiLinearProgress-bar": { bgcolor: loadPercentage > 80 ? "#DD6E6E" : "#8FFF9C" }
                }} 
              />
            </Box>
          </Stack>

          {/* Activated Status - ใช้สีตาม Logic ของตาราง */}
          <Box sx={{ mt: 2 }}>
            {worker.isActive=== false ? (
              <div className="inline-block whitespace-nowrap text-[#DD6E6E] text-[12px] font-bold px-2 py-1 bg-[#FFDEDE] rounded-md">
                Not Activated
              </div>
            ) : (
              <div className="inline-block whitespace-nowrap text-[#6EDD99] text-[12px] font-bold px-2 py-1 bg-[#DEFFE2] rounded-md">
                Activated
              </div>
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}