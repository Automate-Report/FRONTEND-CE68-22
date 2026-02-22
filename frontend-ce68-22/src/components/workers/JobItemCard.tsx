"use client";

import Link from "next/link";
import { Box, Typography, Stack } from "@mui/material";
import { 
  PlayArrow as StartIcon, 
  Flag as EndIcon, 
  Security as AttackIcon, 
  BugReport as BugIcon,
  Schedule as PendingIcon,
  Sync as ProcessingIcon,
  TaskAlt as FinishedIcon,
  Error as FailedIcon,
  CalendarMonth as CalendarIcon
} from "@mui/icons-material";

// Config สำหรับสถานะต่างๆ
const JOB_STATUS_CONFIG: Record<string, { label: string, color: string, bgcolor: string, icon: any }> = {
    processing: {
        label: "Processing",
        color: "#007AFF",
        bgcolor: "rgba(0, 122, 255, 0.1)",
        icon: <ProcessingIcon className="animate-spin" />
    },
    completed: {
        label: "Completed",
        color: "#8FFF9C",
        bgcolor: "rgba(143, 255, 156, 0.1)",
        icon: <FinishedIcon />
    },
    failed: {
        label: "Failed",
        color: "#FE3B46",
        bgcolor: "rgba(254, 59, 70, 0.1)",
        icon: <FailedIcon />
    },
    pending: {
        label: "Pending",
        color: "#9AA6A8",
        bgcolor: "rgba(154, 166, 168, 0.1)",
        icon: <PendingIcon />
    }
};

function DetailItem({ icon, label, value, color = "#9AA6A8" }: any) {
    return (
        <Stack spacing={0.5}>
            <Typography sx={{ color: "#404F57", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
                {label}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ color: "#404F57", display: 'flex' }}>{icon}</Box>
                <Typography variant="body2" sx={{ color: color, fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {value}
                </Typography>
            </Stack>
        </Stack>
    );
}

export function JobItemCard({ job, projectId }: { job: any, projectId: number }) {
    const statusKey = job.status?.toLowerCase() || 'pending';
    const config = JOB_STATUS_CONFIG[statusKey] || JOB_STATUS_CONFIG.pending;

    return (
        <Box sx={{ 
            bgcolor: "#1E2429", borderRadius: "16px", border: "1px solid #404F57", p: 3, transition: "0.3s",
            "&:hover": { borderColor: config.color, bgcolor: "#232A30" }
        }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
                <Box sx={{ p: 2, borderRadius: "50%", bgcolor: config.bgcolor, color: config.color, display: 'flex' }}>
                    {config.icon}
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: "#FBFBFB", fontWeight: "bold", mb: 0.2 }}>
                        {job.name || "Untitled Job"}
                    </Typography>

                    {job.schedule_name && (
                        <Typography 
                            component={Link}
                            href={`/projects/${projectId}/schedule/${job.schedule_id}`}
                            sx={{ 
                                color: "#9AA6A8", fontSize: "13px", display: "flex", alignItems: "center", gap: 0.5, mb: 1.5,
                                textDecoration: "none", "&:hover": { color: "#8FFF9C", textDecoration: "underline" }
                            }}
                        >
                            <CalendarIcon sx={{ fontSize: 14 }} />
                            Schedule: {job.schedule_name}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Box sx={{ 
                            fontSize: "10px", px: 2, py: 0.5, borderRadius: "4px", textTransform: "uppercase", fontWeight: "bold",
                            bgcolor: config.color, color: statusKey === 'completed' ? "#0B0F12" : "#FBFBFB"
                        }}>
                            {config.label}
                        </Box>
                        <Typography variant="caption" sx={{ color: "#404F57" }}>ID: {job.id}</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 4, flex: 2 }}>
                    <DetailItem icon={<StartIcon sx={{ fontSize: 14 }} />} label="Started" value={job.started_at || "-"} />
                    <DetailItem icon={<EndIcon sx={{ fontSize: 14 }} />} label="Finished" value={job.finished_at || (statusKey === 'processing' ? "Running..." : "-")} />
                    <DetailItem icon={<AttackIcon sx={{ fontSize: 14 }} />} label="Attack Type" value={job.attack_type || "General"} color="#FFCC00" />
                    <DetailItem 
                        icon={<BugIcon sx={{ fontSize: 14 }} />} 
                        label="Vulnerabilities" 
                        value={job.vuln_count ?? 0} 
                        color={(job.vuln_count ?? 0) > 0 ? "#FE3B46" : "#8FFF9C"} 
                    />
                </Box>
            </Stack>
        </Box>
    );
}