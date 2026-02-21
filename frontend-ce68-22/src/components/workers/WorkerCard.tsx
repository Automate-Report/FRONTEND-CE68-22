"use client";

import { Box, Typography, Stack, IconButton, LinearProgress, Tooltip } from "@mui/material";
import { 
  Engineering as WorkerIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Download as DownloadIcon,
  VpnKey as KeyIcon,
  Dns as HostIcon,
  Wifi as IpIcon, 
  Favorite as HeartbeatIcon,
  AssignmentTurnedIn as SuccessIcon,
  LinkOff as UnlinkIcon
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
              <Stack direction="row" spacing={0.5} alignItems="center">
                
                {/* ปุ่มที่ 1: สลับระหว่าง Download (ถ้าไม่ Active) และ Unlink (ถ้า Active) */}
                {worker.isActive ? (
                  <Tooltip title="Unlink Worker (Disconnect node)">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        // เรียกใช้ Logic Unlink แยกต่างหาก (หรือใช้ตัวเดียวกับ Delete แต่ส่ง flag ไป)
                        onDelete(e, worker); 
                      }}
                      sx={{ 
                        color: "#FE3B46", 
                        bgcolor: "rgba(254, 59, 70, 0.05)",
                        "&:hover": { bgcolor: "rgba(254, 59, 70, 0.15)" }
                      }}
                    >
                      <UnlinkIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Download Config">
                    <IconButton 
                      size="small" 
                      onClick={onDownload}
                      sx={{ color: "#8FFF9C", "&:hover": { bgcolor: "rgba(143, 255, 156, 0.1)" } }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                {/* ปุ่มที่ 2: Edit (มีตลอด) */}
                <Tooltip title="Edit">
                  <IconButton 
                    size="small" 
                    onClick={(e) => onEdit(e)} 
                    sx={{ color: "#9AA6A8", "&:hover": { color: "#FBFBFB" } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* ปุ่มที่ 3: Delete (มีตลอด ไม่ว่าสถานะไหนก็ลบได้) */}
                <Tooltip title="Delete Permanently">
                  <IconButton 
                    size="small" 
                    onClick={(e) => onDelete(e, worker)} 
                    sx={{ 
                      color: "#FE3B46",
                      opacity: 0.8,
                      "&:hover": { opacity: 1, bgcolor: "rgba(254, 59, 70, 0.1)" }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Stack>

          {/* ข้อมูล Hostname และ Load */}
          <Stack spacing={1} sx={{ mt: 1 }}>
            {/* Hostname Activated Status - ใช้สีตาม Logic ของตาราง */}
            <Box sx={{ 
              // mt: 1, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5 // เว้นระยะห่างระหว่าง Element ภายใน
            }}>
              <Typography variant="body2" sx={{ color: "#9AA6A8", display: "flex", alignItems: "center", gap: 1 }}>
                <HostIcon sx={{ fontSize: 16 }} /> {worker.hostname ?? "No Hostname"}
              </Typography>
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
          
          {/*host ip, last heatbeat, job complete */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={2} 
            sx={{ 
              mt: 2, 
              pt: 1.5, 
              borderTop: "1px solid rgba(64, 79, 87, 0.2)",
              flexWrap: "nowrap", // บังคับให้อยู่บรรทัดเดียว
              overflow: "hidden" 
            }}
          >
            {/* IP Address */}
            <Tooltip title="IP Address">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <IpIcon sx={{ fontSize: 14, color: "#404F57" }} />
                <Typography variant="caption" sx={{ color: "#9AA6A8", fontFamily: "monospace" }}>
                  {worker.internal_ip || "0.0.0.0"}
                </Typography>
              </Stack>
            </Tooltip>

            <Box sx={{ width: "1px", height: "12px", bgcolor: "#404F57", opacity: 0.5 }} /> {/* เส้นคั่น */}

            {/* Jobs Completed */}
            <Tooltip title="Jobs Completed">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <SuccessIcon sx={{ fontSize: 14, color: "#8FFF9C" }} />
                <Typography variant="caption" sx={{ color: "#8FFF9C", fontWeight: "bold" }}>
                  {worker.jobs_completed ?? 0}
                </Typography>
              </Stack>
            </Tooltip>

            <Box sx={{ width: "1px", height: "12px", bgcolor: "#404F57", opacity: 0.5 }} /> {/* เส้นคั่น */}

            {/* Last Heartbeat */}
            <Tooltip title="Last Heartbeat">
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ overflow: "hidden" }}>
                <HeartbeatIcon sx={{ fontSize: 12, color: worker.status === 'online' ? "#8FFF9C" : "#FE3B46" }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "#9AA6A8", 
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis" 
                  }}
                >
                  {worker.last_heartbeat || "No signal"}
                </Typography>
              </Stack>
            </Tooltip>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}