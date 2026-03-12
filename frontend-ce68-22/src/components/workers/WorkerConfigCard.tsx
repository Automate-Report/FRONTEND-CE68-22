"use client";

import { Box, Typography, Stack } from "@mui/material";
import { 
  SettingsInputComponent as ConfigIcon,
  FiberManualRecord as StatusIcon,
  Wifi as IpIcon, 
  Dns as HostIcon, 
  Favorite as HeartbeatIcon,
  EventNote as CalendarIcon,
  CheckCircle as SuccessIcon,
  Person as WorkerNameIcon,
  Memory as ThreadIcon
} from "@mui/icons-material";
import { Worker } from "@/src/types/worker";
import { WORKER_STATUS_MAP } from "@/src/constants/worker-status";
import { WorkerAccessKeySection } from "./WorkerAccessKeySection";

interface WorkerConfigCardProps {
    worker: Worker;
    summaryInfoJob?: {
        total_completed?: number;
    } | null;
    handleRevokeKey: () => Promise<void>;
    role?: string;
}

export function WorkerConfigCard({ worker, summaryInfoJob, handleRevokeKey, role }: WorkerConfigCardProps) {
    // ดึง Config สถานะ
    const currentStatus = worker.status || "unknown";
    const statusConfig = WORKER_STATUS_MAP[currentStatus] || WORKER_STATUS_MAP.unknown;
    const statusThemeColor = currentStatus === 'online' ? "#6EDD99" : currentStatus === 'offline' ? "#DD6E6E" : "#6B7280";

    const configItems = [
        { label: "Worker Name", value: worker.name, icon: <WorkerNameIcon sx={{ fontSize: 18 }} />, color: "#FBFBFB" },
        { 
            label: "Status", 
            value: statusConfig.label, 
            icon: <StatusIcon sx={{ fontSize: 10 }} />, 
            color: statusThemeColor, 
            isStatus: true,
            badgeStyle: statusConfig.style
        },
        { label: "Hostname", value: worker.hostname || "n/a", icon: <HostIcon sx={{ fontSize: 18 }} />, color: "#FBFBFB", isMono: true },
        { label: "Internal IP (Hostname IP)", value: worker.internal_ip || "-", icon: <IpIcon sx={{ fontSize: 18 }} />, color: "#FBFBFB", isMono: true },
        { label: "Max Threads", value: `${worker.thread_number} Threads`, icon: <ThreadIcon sx={{ fontSize: 18 }} />, color: "#FBFBFB" },
        { label: "Created Date", value: worker.created_at || "-", icon: <CalendarIcon sx={{ fontSize: 18 }} />, color: "#FBFBFB" },
        { label: "Last Heartbeat", value: worker.last_heartbeat || "Never", icon: <HeartbeatIcon sx={{ fontSize: 18 }} />, color: worker.status === 'online' ? "#8FFF9C" : "#9AA6A8" },
        { label: "Jobs Completed", value: summaryInfoJob?.total_completed ?? 0, icon: <SuccessIcon sx={{ fontSize: 18 }} />, color: "#8FFF9C", isBold: true },
    ];

    return (
        <Box sx={{ borderRadius: "20px", border: "2px solid #1E2A30", overflow: "hidden", mb: 3, fontFamily: "inherit" }}>
            {/* Header */}
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #1E2A30", display: "flex", alignItems: "center", gap: 1.5, bgcolor: "#1A2025" }}>
                <ConfigIcon sx={{ color: "#8FFF9C", fontSize: 20 }} />
                <Typography sx={{ color: "#E6F0E6", fontWeight: "bold" }}>Worker Configuration</Typography>
            </Box>

            {/* Content Body */}
            <Box sx={{ p: 3 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    {configItems.map((item, index) => (
                        <Box key={index}>
                            <Typography sx={{ color: "#9AA6A8", fontSize: "14px", fontWeight: 600, mb: 1, ml: 0.5 }}>
                                {item.label}
                            </Typography>
                            <Box sx={{ 
                                bgcolor: "#0B0F12", px: 2, py: 1.5, borderRadius: "12px", border: "1px solid #2D2F39", 
                                display: 'flex', alignItems: 'center', maxHeight: "48px",
                                transition: "0.2s", "&:hover": { borderColor: "#404F57" }
                            }}>
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                                    <Box sx={{ 
                                        color: item.color, 
                                        display: 'flex', 
                                        opacity: 0.9, 
                                        ...(item.isStatus && { 
                                            p: 0.6, 
                                            bgcolor: `${item.color}25`, 
                                            borderRadius: "50%",
                                            border: `1px solid ${item.color}40`
                                        }) 
                                    }}>
                                        {item.icon}
                                    </Box>
                                    
                                    {item.isStatus ? (
                                        <div className={`px-2.5 py-0.5 rounded-lg text-[12px] font-bold ${item.badgeStyle}`}>
                                            {item.value}
                                        </div>
                                    ) : (
                                        <Typography sx={{ 
                                            color: item.color, 
                                            fontSize: "16px", 
                                            fontWeight: "base", 
                                            fontFamily: "inherit" 
                                        }}>
                                            {item.value}
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>
                        </Box>
                    ))}
                </div>

                {/* Access Key Section */}
                <WorkerAccessKeySection 
                    accessKeyId={worker.access_key_id} 
                    onRevoke={handleRevokeKey}
                    workerName={worker.name}
                    role={role} // ส่ง prop role ไปยัง WorkerAccessKeySection
                />
            </Box>
        </Box>
    );
}