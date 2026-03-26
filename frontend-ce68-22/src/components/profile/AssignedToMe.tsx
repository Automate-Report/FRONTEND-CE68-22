"use client";
import { useState } from "react";
import { Chip, LinearProgress, Tooltip } from "@mui/material";
import { CalendarToday, FolderOutlined } from "@mui/icons-material";

type Priority = "high" | "medium" | "low";
type Status = "in-progress" | "review" | "todo";

interface AssignedProject {
    id: number;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    dueDate: string;
    progress: number;
    tags: string[];
    projectName: string;
}

const MOCK_ASSIGNED: AssignedProject[] = [
    {
        id: 1,
        title: "Fix login redirect loop on mobile",
        description: "Authentication fails silently on Safari iOS after session timeout, causing infinite redirect.",
        priority: "high",
        status: "in-progress",
        dueDate: "2026-03-27",
        progress: 65,
        tags: ["frontend", "auth"],
        projectName: "Pest10 Core",
    },
    {
        id: 2,
        title: "Implement CSV & PDF export",
        description: "Add export functionality to the analytics dashboard for report generation.",
        priority: "medium",
        status: "review",
        dueDate: "2026-04-02",
        progress: 90,
        tags: ["backend", "export"],
        projectName: "Analytics Suite",
    },
    {
        id: 3,
        title: "Build in-app notification center",
        description: "Design and implement a notification drawer for project updates, mentions, and alerts.",
        priority: "low",
        status: "todo",
        dueDate: "2026-04-15",
        progress: 10,
        tags: ["fullstack", "ui"],
        projectName: "Pest10 Core",
    },
    {
        id: 4,
        title: "Database query optimization",
        description: "Slow queries on the project listing endpoint — needs indexing and caching strategy.",
        priority: "high",
        status: "todo",
        dueDate: "2026-03-30",
        progress: 0,
        tags: ["backend", "performance"],
        projectName: "Infrastructure",
    },
];

const PRIORITY_STYLES: Record<Priority, { label: string; bg: string; color: string }> = {
    high: { label: "High", bg: "#3B1010", color: "#F87171" },
    medium: { label: "Medium", bg: "#2E2510", color: "#FBB04A" },
    low: { label: "Low", bg: "#0E2B17", color: "#4ADE80" },
};

const STATUS_STYLES: Record<Status, { label: string; dot: string }> = {
    "in-progress": { label: "In progress", dot: "#60A5FA" },
    "review": { label: "In review", dot: "#C084FC" },
    "todo": { label: "To do", dot: "#6B7280" },
};

const FILTERS: { label: string; value: "all" | Status }[] = [
    { label: "All", value: "all" },
    { label: "In progress", value: "in-progress" },
    { label: "In review", value: "review" },
    { label: "To do", value: "todo" },
];

function getDueLabel(dateStr: string): { text: string; color: string } {
    const due = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((due.getTime() - now.getTime()) / 86400000);
    if (diff < 0) return { text: "Overdue", color: "#F87171" };
    if (diff === 0) return { text: "Due today", color: "#FB923C" };
    if (diff <= 3) return { text: `Due in ${diff}d`, color: "#FB923C" };
    return {
        text: due.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        color: "#9AA6A8",
    };
}

export const AssignedToMe = () => {
    const [activeFilter, setActiveFilter] = useState < "all" | Status > ("all");

    const filtered = MOCK_ASSIGNED.filter(
        (p) => activeFilter === "all" || p.status === activeFilter
    );

    return (
        <div className="px-15 py-8 flex flex-col gap-6">
            {/* Filter bar */}
            <div className="flex items-center gap-3 flex-wrap">
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setActiveFilter(f.value)}
                        className="px-4 py-1.5 rounded-full text-sm transition-all border"
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
                <span className="ml-auto text-xs text-[#5A6A72] bg-[#1A2025] border border-[#2D3B42] rounded-full px-3 py-1">
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
                    {filtered.map((task) => {
                        const due = getDueLabel(task.dueDate);
                        const prio = PRIORITY_STYLES[task.priority];
                        const stat = STATUS_STYLES[task.status];
                        return (
                            <div
                                key={task.id}
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

                                {/* Row 2: Description */}
                                <p className="text-[#6B7D84] text-[13px] leading-relaxed mb-3">
                                    {task.description}
                                </p>

                                {/* Row 3: Meta */}
                                <div className="flex items-center gap-4 flex-wrap mb-3">
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
                                    <div className="flex items-center gap-1.5">
                                        <CalendarToday sx={{ fontSize: 12, color: "#5A6A72" }} />
                                        <span className="text-xs font-medium" style={{ color: due.color }}>
                                            {due.text}
                                        </span>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex items-center gap-1.5 ml-auto">
                                        {task.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] px-2 py-0.5 rounded-full border border-[#2D3B42] text-[#5A6A72]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Row 4: Progress bar */}
                                <div>
                                    <div className="flex justify-between text-[11px] text-[#5A6A72] mb-1.5">
                                        <span>Progress</span>
                                        <span>{task.progress}%</span>
                                    </div>
                                    <LinearProgress
                                        variant="determinate"
                                        value={task.progress}
                                        sx={{
                                            height: 4,
                                            borderRadius: 2,
                                            bgcolor: "#232E34",
                                            "& .MuiLinearProgress-bar": {
                                                bgcolor: task.progress >= 80 ? "#4ADE80" : task.progress >= 40 ? "#60A5FA" : "#6B7280",
                                                borderRadius: 2,
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};