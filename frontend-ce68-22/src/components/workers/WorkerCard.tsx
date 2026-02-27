"use client";

import { 
  Box, 
  Typography, 
  Stack, 
  IconButton, 
  LinearProgress, 
  Tooltip, 
  CircularProgress 
} from "@mui/material";
import { 
  Engineering as WorkerIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Download as DownloadIcon, 
  Dns as HostIcon, 
  Wifi as IpIcon, 
  Favorite as HeartbeatIcon, 
  LinkOff as UnlinkIcon 
} from "@mui/icons-material";

// ✅ นำเข้า Global Store เพื่อเช็คสถานะการดาวน์โหลดที่ Sync กันทั้งแอป
import { useDownloadStore } from "@/src/hooks/worker/use-WorkerDownloadStore";
import { WORKER_STATUS_MAP } from "@/src/constants/worker-status";
import { Worker as WorkerType } from "@/src/types/worker";

interface WorkerCardProps {
  worker: WorkerType;
  canManage: boolean;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent, worker: WorkerType) => void;
  onUnlink: (e: React.MouseEvent, worker: WorkerType) => void;
  // หมายเหตุ: onDownload จะถูกเรียกใช้ผ่าน Store ภายในตัวคอมโพเนนต์เอง 
  // หรือรับมาจากหน้า Page เพื่อหยุด Event Bubbling
  onDownload?: (e: React.MouseEvent) => void;
}

export function WorkerCard({ 
  worker, 
  canManage, 
  onEdit, 
  onDelete, 
  onUnlink,
  onDownload 
}: WorkerCardProps) {
  
  // ✅ ดึงสถานะจาก Global Store
  const startDownload = useDownloadStore((state) => state.startDownload);
  const globalIsLoading = useDownloadStore((state) => state.isDownloading);
  const globalProgress = useDownloadStore((state) => state.progress);
  const currentDownloadingId = useDownloadStore((state) => state.currentWorkerId);

  // ✅ เช็คว่า Worker ตัวนี้กำลังถูกดาวน์โหลดอยู่หรือไม่ (ไม่ว่าจะกดจากที่นี่ หรือหน้า Detail)
  const isThisWorkerDownloading = globalIsLoading && currentDownloadingId === worker.id;

  const statusConfig = WORKER_STATUS_MAP[worker.status] || WORKER_STATUS_MAP.unknown;
  const currentLoad = worker.current_load ?? 0;
  const maxThread = worker.thread_number ?? 1;
  const loadPercentage = (currentLoad / maxThread) * 100;

  // --- 🛠️ Event Handlers (หยุดการ Click ทะลุไปยัง Link ด้านนอก) ---

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // ✅ สำคัญ: หยุดไม่ให้เด้งไปหน้า Detail
    
    if (onDownload) {
      onDownload(e);
    } else if (!globalIsLoading) {
      startDownload(worker.id, worker.name);
    }
  };

  const handleUnlinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // ✅ หยุดไม่ให้เด้งไปหน้า Detail
    onUnlink(e, worker);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // ✅ หยุดไม่ให้เด้งไปหน้า Detail
    onDelete(e, worker);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // ✅ หยุดไม่ให้เด้งไปหน้า Detail
    if (onEdit) onEdit(e);
  };

  return (
    <Box sx={{ 
      bgcolor: "#1E2429", 
      borderRadius: "20px", 
      border: "1px solid #404F57", 
      p: 3, 
      transition: "0.3s", 
      cursor: "pointer", 
      "&:hover": { borderColor: "#8FFF9C", transform: "translateY(-4px)" } 
    }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        {/* Icon Area */}
        <Box sx={{ 
          p: 1.5, 
          bgcolor: "rgba(143, 255, 156, 0.1)", 
          borderRadius: "12px", 
          color: "#8FFF9C", 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <WorkerIcon sx={{ fontSize: 32 }} />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          {/* Header & Actions */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
              <Typography variant="h6" sx={{ color: "#FBFBFB", fontWeight: "bold", lineHeight: 1 }}>
                {worker.name}
              </Typography>
              <div className={`inline-block whitespace-nowrap text-[12px] font-semibold px-2.5 py-0.5 rounded-lg ${statusConfig.style}`}>
                {statusConfig.label}
              </div>
            </Box>
            
            {canManage && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                {worker.owner ? (
                  <Tooltip title="Disconnect Node">
                    <IconButton size="small" onClick={handleUnlinkClick} sx={{ color: "#FF9800", bgcolor: "rgba(255, 152, 0, 0.05)", "&:hover": { bgcolor: "rgba(255, 152, 0, 0.15)" } }}>
                      <UnlinkIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Download Config">
                    <IconButton 
                      size="small" 
                      onClick={handleDownloadClick} 
                      disabled={globalIsLoading && !isThisWorkerDownloading} 
                      sx={{ color: "#8FFF9C" }}
                    >
                      {isThisWorkerDownloading ? (
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 0.5 }}>
                          {globalProgress > 0 ? (
                            <>
                              <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 'bold', color: "#8FFF9C" }}>{globalProgress}%</Typography>
                              <CircularProgress variant="determinate" value={globalProgress} size={16} sx={{ color: "#8FFF9C" }} />
                            </>
                          ) : (
                            <CircularProgress size={16} sx={{ color: "#8FFF9C" }} />
                          )}
                        </Stack>
                      ) : (
                        <DownloadIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                )}
                
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={handleEditClick} sx={{ color: "#9AA6A8", "&:hover": { color: "#FBFBFB" } }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={handleDeleteClick} sx={{ color: "#FE3B46", opacity: 0.8, "&:hover": { opacity: 1, bgcolor: "rgba(254, 59, 70, 0.1)" } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Stack>
          
          {/* Worker Info */}
          <Stack spacing={1} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: "#9AA6A8" }}>
                Owner: {worker.owner ?? "Available for use"}
              </Typography>
              <div className={`text-[12px] font-bold px-2 py-0.5 rounded-md ${worker.owner === null ? "text-[#6EDD99] bg-[#6EDD99]/10" : "text-[#DD6E6E] bg-[#DD6E6E]/10"}`}>
                {worker.owner === null ? "Available" : "In Use"}
              </div>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: "#9AA6A8", display: "flex", alignItems: "center", gap: 1 }}>
                <HostIcon sx={{ fontSize: 16 }} /> {worker.hostname ?? "No Hostname"}
              </Typography>
            </Box>
            
            <Box>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" sx={{ color: "#FBFBFB", fontWeight: "bold" }}>
                  Load: {currentLoad}/{maxThread}
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
                  "& .MuiLinearProgress-bar": { 
                    bgcolor: loadPercentage > 85 ? "#FE3B46" : loadPercentage > 60 ? "#FFCC00" : "#8FFF9C" 
                  } 
                }} 
              />
            </Box>
          </Stack>
          
          {/* Footer Stats */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2, pt: 1.5, borderTop: "1px solid rgba(64, 79, 87, 0.2)" }}>
            <Tooltip title="IP">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <IpIcon sx={{ fontSize: 14, color: "#404F57" }} />
                <Typography variant="caption" sx={{ color: "#9AA6A8", fontFamily: "monospace" }}>
                  {worker.internal_ip || "0.0.0.0"}
                </Typography>
              </Stack>
            </Tooltip>
            
            <Box sx={{ width: "1px", height: "12px", bgcolor: "#404F57", opacity: 0.5 }} />
            
            <Tooltip title="Pulse">
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ overflow: "hidden" }}>
                <HeartbeatIcon sx={{ fontSize: 12, color: worker.status === 'online' ? "#8FFF9C" : "#FE3B46" }} />
                <Typography variant="caption" sx={{ color: "#9AA6A8", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}>
                  HB: {worker.last_heartbeat || "No signal"}
                </Typography>
              </Stack>
            </Tooltip>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}