"use client";

import { Box, Typography } from "@mui/material";
import { 
  Assignment as TotalJobIcon, 
  CheckCircle as CompletedIcon, 
  Error as FailedIcon, 
  BugReport as FindingIcon,
  Speed as PerformanceIcon
} from "@mui/icons-material";

// ปรับ Interface ให้รองรับค่าที่เป็น undefined (ใช้ ?)
interface WorkerSummaryStatsProps {
    summary: {
        total_jobs?: number;
        total_completed?: number;
        total_failed?: number;
        total_findings?: number;
    } | null;
    worker: {
        current_load?: number; // เพิ่ม ? เพื่อรองรับ undefined
        thread_number: number;
    };
}

export function WorkerSummaryStats({ summary, worker }: WorkerSummaryStatsProps) {
    const statsItems = [
        { 
            label: "Total Jobs", 
            value: summary?.total_jobs ?? 0, 
            color: "#FBFBFB", 
            icon: <TotalJobIcon /> 
        },
        { 
            label: "Completed", 
            value: summary?.total_completed ?? 0, 
            color: "#8FFF9C", 
            icon: <CompletedIcon /> 
        },
        { 
            label: "Failed", 
            value: summary?.total_failed ?? 0, 
            color: "#FE3B46", 
            icon: <FailedIcon /> 
        },
        { 
            label: "Total Findings", 
            value: summary?.total_findings ?? 0, 
            color: "#FFCC00", 
            icon: <FindingIcon /> 
        },
        { 
            label: "Current Load", 
            // ใช้ Optional Chaining และ Default value 0
            value: `${worker?.current_load ?? 0}/${worker?.thread_number ?? 0}`, 
            color: "#3B9FFE", 
            icon: <PerformanceIcon /> 
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {statsItems.map((item, i) => (
                <Box key={i} sx={{ 
                    bgcolor: "#1E2429", 
                    p: 2.5, 
                    borderRadius: "16px", 
                    border: "1px solid #404F57", 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    transition: '0.2s', 
                    '&:hover': { 
                        transform: 'translateY(-4px)', 
                        borderColor: item.color,
                        boxShadow: `0 4px 20px ${item.color}15`
                    }
                }}>
                    <Box>
                        <Typography variant="h4" sx={{ color: item.color, fontWeight: 900 }}>
                            {item.value}
                        </Typography>
                        <Typography sx={{ 
                            color: "#9AA6A8", 
                            fontSize: "11px", 
                            fontWeight: 800, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {item.label}
                        </Typography>
                    </Box>
                    <Box sx={{ 
                        width: 44, 
                        height: 44, 
                        borderRadius: "12px", 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: item.color, 
                        bgcolor: `${item.color}10` 
                    }}>
                        {item.icon}
                    </Box>
                </Box>
            ))}
        </div>
    );
}