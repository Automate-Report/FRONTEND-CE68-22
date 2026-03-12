"use client";

import { use, useState } from "react";
import {
    Box, Typography, List, ListItemButton, ListItemText,
    Stack, CircularProgress, IconButton, Menu, MenuItem,
    Badge
} from "@mui/material";
import {
    ArrowForwardIos as ArrowIcon,
    FilterList as FilterIcon,
    CheckCircle as SelectedIcon
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { VulnerabilitySummary } from "@/src/components/vulns/VulnerabilitySummary";
import { GenericPagination } from "@/src/components/Common/GenericPagination";
import { useProject } from "@/src/hooks/project/use-project";
import { useVulnsTask } from "@/src/hooks/vuln/use-vulnsTask";

export default function TriageLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;
    const currentVulnId = params.vulnId as string;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [statusFilter, setStatusFilter] = useState("ALL");

    // State สำหรับ Menu Filter
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const { data: project } = useProject(parseInt(projectId));
    const { data: vulnData, isLoading: isVulnLoading } = useVulnsTask(
        parseInt(projectId), page + 1, rowsPerPage, "severity", "desc", "", statusFilter
    );

    const issues = vulnData?.items || [];
    const totalCount = vulnData?.total || 0;

    const ownerStatusOptions = [
        { label: "All Status", value: "ALL" },
        { label: "Open Issues", value: "open" },
        { label: "In Progress", value: "in_progress" },
        { label: "Fixed", value: "fixed" },
        { label: "True Positive", value: "tp" },
        { label: "False Positive", value: "fp" },
    ];

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = (value?: string) => {
        if (value) {
            setStatusFilter(value);
            setPage(0);
        }
        setAnchorEl(null);
    };

    return (
        <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl">
            <Box>
                <GenericBreadcrums items={[
                    { label: "Home", href: "/main" },
                    { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
                    { label: "Triage & Fix", href: undefined }
                ]} />
                <div className="w-full flex flex-col mb-6">
                    <h1 className="font-bold text-[36px]">
                        Triage and Fix
                    </h1>
                </div>
            </Box>

            <VulnerabilitySummary
                projectId={parseInt(projectId)}
                onFilterChange={(newFilter: string) => setStatusFilter(newFilter)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px] mt-2">
                {/* Sidebar Manager (4/12) */}
                <Box className="lg:col-span-4 bg-[#1E2429] rounded-2xl border-[2px] border-[#404F57] overflow-hidden flex flex-col h-fit">

                    {/* Sidebar Header with Filter Button on Top Right */}
                    <Box p={2} bgcolor="#0B0F12" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#404F57", fontSize: '12px', letterSpacing: 0.5, paddingLeft: 1 }}>
                            ISSUES ({totalCount})
                        </Typography>

                        <Box>
                            <Badge
                                color="error"
                                variant="dot"
                                invisible={statusFilter === "ALL"}
                                sx={{ "& .MuiBadge-badge": { bgcolor: "#8FFF9C" } }}
                            >
                                <IconButton
                                    onClick={handleFilterClick}
                                    size="small"
                                    sx={{
                                        color: statusFilter === "ALL" ? "#404F57" : "#8FFF9C",
                                        bgcolor: statusFilter === "ALL" ? "transparent" : "rgba(143, 255, 156, 0.05)",
                                        border: "1px solid",
                                        borderColor: statusFilter === "ALL" ? "transparent" : "rgba(143, 255, 156, 0.2)",
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                                    }}
                                >
                                    <FilterIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Badge>

                            {/* Filter Menu */}
                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={() => handleFilterClose()}
                                PaperProps={{
                                    sx: {
                                        bgcolor: "#1A1F23",
                                        color: "#E6F0E6",
                                        border: "1px solid #404F57",
                                        minWidth: '180px',
                                        mt: 1
                                    }
                                }}
                            >
                                {ownerStatusOptions.map((opt) => (
                                    <MenuItem
                                        key={opt.value}
                                        onClick={() => handleFilterClose(opt.value)}
                                        sx={{
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            "&:hover": { bgcolor: "rgba(143, 255, 156, 0.05)", color: "#8FFF9C" }
                                        }}
                                    >
                                        {opt.label}
                                        {statusFilter === opt.value && <SelectedIcon sx={{ fontSize: 16, color: "#8FFF9C" }} />}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Box>

                    {/* List Area */}
                    <List sx={{ p: 0, minHeight: '480px', bgcolor: "#0f1518" }}>
                        {isVulnLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress size={24} sx={{ color: "#8FFF9C" }} /></Box>
                        ) : issues.length > 0 ? (
                            issues.map((issue) => (
                                <ListItemButton
                                    key={issue.id}
                                    selected={currentVulnId === issue.id.toString()}
                                    onClick={() => router.push(`/projects/${projectId}/triage/${issue.id}`)}
                                    sx={{
                                        borderBottom: "1px solid rgba(64, 79, 87, 0.2)", py: 2, px: 2.5,
                                        "&.Mui-selected": {
                                            bgcolor: "rgba(143, 255, 156, 0.05)",
                                            borderLeft: "4px solid #8FFF9C",
                                            "& .MuiTypography-root": { color: "#8FFF9C" }
                                        },
                                        "&:hover": {
                                            bgcolor: "rgba(143, 255, 156, 0.05)",
                                            "& .MuiTypography-root": { color: "#8FFF9C" }
                                        },
                                        "&.Mui-selected:hover": {
                                            bgcolor: "rgba(143, 255, 156, 0.08)",
                                            "& .MuiTypography-root": { color: "#8FFF9C" }
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography sx={{ fontWeight: 700, color: "#FBFBFB", fontSize: "14px" }}>
                                                {issue.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: issue.status === 'fixed' ? '#8FFF9C' : '#FE3B46' }} />
                                                <Typography sx={{ fontSize: "11px", color: "#9AA6A8" }}>
                                                    {issue.asset_name}
                                                </Typography>
                                            </Stack>
                                        }
                                        // ✅ เพิ่มบรรทัดนี้เพื่อเปลี่ยนจาก <p> เป็น <div>
                                        secondaryTypographyProps={{ component: 'div' }}
                                    />
                                    <ArrowIcon sx={{ fontSize: 12, color: "#404F57" }} />
                                </ListItemButton>
                            ))
                        ) : (
                            <Box sx={{ p: 8, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: "#404F57" }}>No matching issues found.</Typography>
                            </Box>
                        )}
                    </List>

                    {/* Pagination */}
                    <Box sx={{ p: 1, bgcolor: "#0B0F12" }}>
                        <GenericPagination
                            count={totalCount} page={page} rowsPerPage={rowsPerPage}
                            onPageChange={(newPage) => setPage(newPage)}
                            onRowsPerPageChange={(newSize) => { setRowsPerPage(newSize); setPage(0); }}
                            rowsPerPageOptions={[6]}
                            labelRowsPerPage=""
                        />
                    </Box>
                </Box>

                {/* Detail View (8/12) */}
                <Box className="lg:col-span-8">{children}</Box>
            </div>
        </div>
    );
}