"use client";

import { Box, Typography } from "@mui/material";
import {
    Assignment as TotalJobIcon,
    CheckCircle as CompletedIcon,
    Error as FailedIcon,
    BugReport as FindingIcon,
    Speed as PerformanceIcon
} from "@mui/icons-material";
import CardWithIcon from "../Common/CardWithIcon";

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
            label: "Vuln Found",
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
        <div className="grid grid-cols-1 lg:grid-cols-6 2xl:grid-cols-5 gap-4 mb-8">
            {statsItems.map((item, i) => (
                <CardWithIcon
                    key={i}
                    responsive={i < 3 ? "lg:col-span-2 2xl:col-span-1" : "lg:col-span-3 2xl:col-span-1"}
                    icon={item.icon}
                    title={item.label}
                    dataDisplay={item.value}
                    dataDisplayColor={item.color}
                    iconColor={item.color}
                    dataDisplaySize="24px"
                    description=""
                />
            ))}
        </div>
    );
}