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

// --- Utility: Format Date (DD MMM YYYY HH:mm) ---
const formatDate = (dateString: string | null) => {
    if (!dateString || dateString === "-") return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(/,/g, '');
};

const JOB_STATUS_CONFIG: Record<string, { label: string, color: string, bgcolor: string, icon: any }> = {
    processing: {
        label: "Processing",
        color: "#007AFF",
        bgcolor: "rgba(0, 122, 255, 0.1)",
        icon: <ProcessingIcon className="animate-spin" sx={{ fontSize: 20 }} />
    },
    completed: {
        label: "Completed",
        color: "#8FFF9C",
        bgcolor: "rgba(143, 255, 156, 0.1)",
        icon: <FinishedIcon sx={{ fontSize: 20 }} />
    },
    failed: {
        label: "Failed",
        color: "#FE3B46",
        bgcolor: "rgba(254, 59, 70, 0.1)",
        icon: <FailedIcon sx={{ fontSize: 20 }} />
    },
    pending: {
        label: "Pending",
        color: "#9AA6A8",
        bgcolor: "rgba(154, 166, 168, 0.1)",
        icon: <PendingIcon sx={{ fontSize: 20 }} />
    }
};

function DetailItem({ icon, label, value, color = "#9AA6A8" }: any) {
    return (
        <Stack spacing={0.5} sx={{ width: '100%' }}>
            <Typography sx={{ color: "#404F57", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
                {label}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ color: "#404F57", display: 'flex', flexShrink: 0 }}>{icon}</Box>
                <Typography variant="body2" sx={{ 
                    color: color, 
                    fontWeight: 500, 
                    fontSize: '13px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
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
            bgcolor: "#1E2429", borderRadius: "16px", border: "1px solid #404F57", p: 2.5, transition: "0.3s",
            "&:hover": { borderColor: config.color, bgcolor: "#232A30" }
        }}>
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="center">
                
                {/* 1. Status Icon */}
                <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: config.bgcolor, color: config.color, display: 'flex', flexShrink: 0 }}>
                    {config.icon}
                </Box>

                {/* 2. Info Section - ปรับให้กว้างขึ้น (flex: 2) */}
                <Box sx={{ flex: 2, minWidth: '220px' }}>
                    <Typography variant="subtitle1" sx={{ color: "#FBFBFB", fontWeight: "bold", mb: 0.2 }}>
                        {job.name || "Untitled Job"}
                    </Typography>

                    {job.schedule_name && (
                        <Typography 
                            component={Link}
                            href={`/projects/${projectId}/schedule/${job.schedule_id}`}
                            sx={{ 
                                color: "#9AA6A8", fontSize: "12px", display: "flex", alignItems: "center", gap: 0.5, mb: 1,
                                textDecoration: "none", "&:hover": { color: "#8FFF9C", textDecoration: "underline" }
                            }}
                        >
                            <CalendarIcon sx={{ fontSize: 13 }} />
                            Schedule: {job.schedule_name}
                        </Typography>
                    )}

                    <Box sx={{ 
                        display: 'inline-block',
                        fontSize: "9px", px: 1.5, py: 0.2, borderRadius: "4px", textTransform: "uppercase", fontWeight: "900",
                        bgcolor: config.color, color: "#0B0F12"
                    }}>
                        {config.label}
                    </Box>
                </Box>

                {/* 3. Details Grid - แบ่ง 4 คอลัมน์เท่ากัน (flex: 3) */}
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { 
                        xs: '1fr 1fr', 
                        md: 'repeat(4, 1fr)' 
                    }, 
                    gap: 3, 
                    flex: 3,
                    width: '100%'
                }}>
                    <DetailItem icon={<StartIcon sx={{ fontSize: 14 }} />} label="Started" value={formatDate(job.started_at)} />
                    <DetailItem icon={<EndIcon sx={{ fontSize: 14 }} />} label="Finished" value={statusKey === 'processing' ? "Running..." : formatDate(job.finished_at)} />
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