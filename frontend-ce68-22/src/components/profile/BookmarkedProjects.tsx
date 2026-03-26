"use client";
import { useState } from "react";
import { BookmarkRemove, PeopleOutline, CalendarToday } from "@mui/icons-material";

type ProjectStatus = "active" | "completed" | "on-hold";

interface BookmarkedProject {
    id: number;
    name: string;
    description: string;
    status: ProjectStatus;
    members: number;
    lastUpdated: string;
    tags: string[];
    thumbnail: string;
}

const MOCK_BOOKMARKED: BookmarkedProject[] = [
    {
        id: 1,
        name: "Pest10 Core",
        description: "Main bug tracking platform. Handles project creation, issue management, and team collaboration.",
        status: "active",
        members: 8,
        lastUpdated: "2026-03-25",
        tags: ["Next.js", "TypeScript", "MUI"],
        thumbnail: "PC",
    },
    {
        id: 2,
        name: "Analytics Suite",
        description: "Data visualization dashboard for project metrics, sprint velocity, and bug trends.",
        status: "active",
        members: 4,
        lastUpdated: "2026-03-20",
        tags: ["React", "D3", "FastAPI"],
        thumbnail: "AS",
    },
    {
        id: 3,
        name: "Mobile Companion",
        description: "React Native app for on-the-go issue reporting and push notification support.",
        status: "on-hold",
        members: 3,
        lastUpdated: "2026-02-10",
        tags: ["React Native", "Expo"],
        thumbnail: "MC",
    },
    {
        id: 4,
        name: "Auth Service",
        description: "Centralized authentication microservice with JWT, OAuth2, and role-based access control.",
        status: "completed",
        members: 2,
        lastUpdated: "2026-01-15",
        tags: ["Go", "PostgreSQL"],
        thumbnail: "AU",
    },
];

const STATUS_STYLES: Record<ProjectStatus, { label: string; bg: string; color: string }> = {
    active: { label: "Active", bg: "#0E2B17", color: "#4ADE80" },
    completed: { label: "Completed", bg: "#0E1C2B", color: "#60A5FA" },
    "on-hold": { label: "On hold", bg: "#2E2510", color: "#FBB04A" },
};

const THUMB_COLORS = [
    { bg: "#1A2B1A", color: "#4ADE80" },
    { bg: "#1A1A2B", color: "#818CF8" },
    { bg: "#2B1A1A", color: "#F87171" },
    { bg: "#1A2328", color: "#60A5FA" },
];

const FILTERS: { label: string; value: "all" | ProjectStatus }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "On hold", value: "on-hold" },
];

export const BookmarkedProjects = () => {
    const [activeFilter, setActiveFilter] = useState<"all" | ProjectStatus>("all");

    const filtered = MOCK_BOOKMARKED.filter(
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
                    {filtered.length} project{filtered.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-20 text-[#5A6A72] text-sm">
                    No bookmarked projects in this category
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((project, idx) => {
                        const stat = STATUS_STYLES[project.status];
                        const thumb = THUMB_COLORS[idx % THUMB_COLORS.length];
                        return (
                            <div
                                key={project.id}
                                className="rounded-xl border border-[#232E34] bg-[#161B1F] hover:border-[#3A4A52] transition-all duration-150 cursor-pointer flex flex-col"
                            >
                                {/* Card header */}
                                <div className="flex items-start gap-4 p-5 pb-4">
                                    {/* Thumbnail */}
                                    <div
                                        className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                                        style={{ background: thumb.bg, color: thumb.color }}
                                    >
                                        {project.thumbnail}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-[#E6F0E6] font-semibold text-[15px] leading-tight truncate">
                                                {project.name}
                                            </h3>
                                            <span
                                                className="text-[11px] px-2.5 py-0.5 rounded-full font-medium flex-shrink-0"
                                                style={{ background: stat.bg, color: stat.color }}
                                            >
                                                {stat.label}
                                            </span>
                                        </div>
                                        <p className="text-[#6B7D84] text-[13px] leading-relaxed mt-1.5 line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[11px] px-2 py-0.5 rounded-full border border-[#2D3B42] text-[#5A6A72]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="mt-auto border-t border-[#1E2A30] px-5 py-3 flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <PeopleOutline sx={{ fontSize: 14, color: "#5A6A72" }} />
                                        <span className="text-xs text-[#9AA6A8]">{project.members} members</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CalendarToday sx={{ fontSize: 12, color: "#5A6A72" }} />
                                        <span className="text-xs text-[#9AA6A8]">
                                            {new Date(project.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </span>
                                    </div>
                                    <button className="ml-auto text-[#5A6A72] hover:text-[#F87171] transition-colors">
                                        <BookmarkRemove sx={{ fontSize: 18 }} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};