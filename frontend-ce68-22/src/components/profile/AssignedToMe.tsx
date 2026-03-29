"use client";
import { useState } from "react";
import { Chip, LinearProgress, Tooltip } from "@mui/material";
import { CalendarToday, FolderOutlined } from "@mui/icons-material";

type Priority = "high" | "medium" | "low";
type Status = "in_progress" | "fixed" | "open" | "wont_fix";

interface AssignedProject {
    title: string;
    priority: Priority;
    status: Status;
    projectName: string;
}

const MOCK_ASSIGNED: AssignedProject[] = [
    {
        title: "Issues name",
        priority: "high",
        status: "in_progress",
        projectName: "Project name",
    },
    {
        title: "Implement CSV & PDF export",
        priority: "medium",
        status: "open",
        projectName: "Analytics Suite",
    },
    {
        title: "Build in-app notification center",
        priority: "low",
        status: "wont_fix",
        projectName: "Pest10 Core",
    },
    {
        title: "Database query optimization",
        priority: "high",
        status: "fixed",
        projectName: "Infrastructure",
    },
];

const PRIORITY_STYLES: Record<Priority, { label: string; bg: string; color: string }> = {
    high: { label: "High", bg: "#3B1010", color: "#F87171" },
    medium: { label: "Medium", bg: "#2E2510", color: "#FBB04A" },
    low: { label: "Low", bg: "#0E2B17", color: "#4ADE80" },
};

const STATUS_STYLES: Record<Status, { label: string; dot: string }> = {
    "fixed": { label: "Fixed", dot: "#8FFF9C" },
    "in_progress": { label: "In progress", dot: "#007AFF" },
    "open": { label: "Open", dot: "#FE3B46" },
    "wont_fix": { label: "Won't fix", dot: "#404F57" },
};

const FILTERS: { label: string; value: "all" | Status }[] = [
    { label: "All", value: "all" },
    { label: "In progress", value: "in_progress" },
    { label: "Fixed", value: "fixed" },
    { label: "Open", value: "open" },
    { label: "Won't fix", value: "wont_fix" },
];

// function getDueLabel(dateStr: string): { text: string; color: string } {
//     const due = new Date(dateStr);
//     const now = new Date();
//     const diff = Math.ceil((due.getTime() - now.getTime()) / 86400000);
//     if (diff < 0) return { text: "Overdue", color: "#F87171" };
//     if (diff === 0) return { text: "Due today", color: "#FB923C" };
//     if (diff <= 3) return { text: `Due in ${diff}d`, color: "#FB923C" };
//     return {
//         text: due.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//         color: "#9AA6A8",
//     };
// }

export const AssignedToMe = () => {
    const [activeFilter, setActiveFilter] = useState < "all" | Status > ("all");

    const filtered = MOCK_ASSIGNED.filter(
        (p) => activeFilter === "all" || p.status === activeFilter
    );

    return (
        <div className="px-15 pb-8 flex flex-col">
            {/* Filter bar */}
            <div className="flex items-center gap-3 flex-wrap sticky z-20 top-[52px] bg-[#0F1518] py-6">
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setActiveFilter(f.value)}
                        className="px-4 py-2 rounded-xl text-sm transition-all border-2 min-w-[150px]"
                        style={{
                            background: activeFilter === f.value ? "#8FFF9C" : "transparent",
                            color: activeFilter === f.value ? "#0A1A0D" : "#9AA6A8",
                            borderColor: activeFilter === f.value ? "#8FFF9C" : "#2D3B42",
                            fontWeight: activeFilter === f.value ? 600 : 400,
                        }}
                    >
                        {f.label}
                    </button>
                ))}
                <span className="ml-auto text-sm text-[#8fff9c] bg-[#1A2025] border border-[#2D3B42] rounded-xl px-4 py-2 ">
                    {filtered.length} task{filtered.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
                <div className="text-center py-20 text-[#5A6A72] text-sm">
                    No tasks in this category
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map((task,index) => {
                        const prio = PRIORITY_STYLES[task.priority];
                        const stat = STATUS_STYLES[task.status as Status];
                        return (
                            <div
                                key={index}
                                className="group rounded-xl border border-[#232E34] bg-[#161B1F] hover:border-[#3A4A52] transition-all duration-150 px-5 py-4 cursor-pointer"
                            >
                                {/* Row 1: Title + Priority badge */}
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <span className="text-[#E6F0E6] font-semibold text-[15px] leading-tight">
                                        {task.title}
                                    </span>
                                    <span
                                        className="text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0"
                                        style={{ background: prio.bg, color: prio.color }}
                                    >
                                        {prio.label}
                                    </span>
                                </div>

                                {/* Row 3: Meta */}
                                <div className="flex items-center gap-4 flex-wrap">
                                    {/* Status */}
                                    <div className="flex items-center gap-1.5">
                                        <span
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{ background: stat.dot }}
                                        />
                                        <span className="text-xs text-[#9AA6A8]">{stat.label}</span>
                                    </div>

                                    {/* Project */}
                                    <div className="flex items-center gap-1.5">
                                        <FolderOutlined sx={{ fontSize: 13, color: "#5A6A72" }} />
                                        <span className="text-xs text-[#9AA6A8]">{task.projectName}</span>
                                    </div>

                                    {/* Due date */}
                                    {/* <div className="flex items-center gap-1.5">
                                        <CalendarToday sx={{ fontSize: 12, color: "#5A6A72" }} />
                                        <span className="text-xs font-medium" style={{ color: due.color }}>
                                            {due.text}
                                        </span>
                                    </div> */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};