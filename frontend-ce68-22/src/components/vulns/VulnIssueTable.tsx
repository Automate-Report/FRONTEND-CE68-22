"use client";

import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Typography, Chip, Box, Avatar
} from "@mui/material";
import { useRouter } from "next/navigation";
import { UsernameDisplay } from "../users/UsernameDisplay";
import { VulnIssue } from "@/src/types/vuln";
import {
    CheckCircle as TPIcon,
    Cancel as FPIcon,
    HelpOutline as PendingIcon
} from "@mui/icons-material";

// Helper components needed for the icons
import { Stack, Tooltip } from "@mui/material";

interface VulnIssueTableProps {
    issues: VulnIssue[];
    projectId: number;
    isLoading?: boolean;
}

export function VulnIssueTable({ issues, projectId, isLoading }: VulnIssueTableProps) {
    const router = useRouter();

    const getSeverityColor = (severity: string) => {
        const s = severity?.toLowerCase();
        if (s === 'critical' || s === 'high') return "#FE3B46";
        if (s === 'medium') return "#FFCC00";
        if (s === 'low') return "#007AFF";
        return "#9AA6A8";
    };

    // ฟังก์ชันช่วยจัดการสีตาม Status (รวม Won't Fix)
    const getStatusStyles = (status: string) => {
        const s = status?.toLowerCase();
        if (s === 'fixed') return { color: "#8FFF9C", bg: "rgba(143, 255, 156, 0.1)" };
        if (s === 'in_progress') return { color: "#007AFF", bg: "rgba(0, 122, 255, 0.1)" };
        if (s === 'wont_fix') return { color: "#9AA6A8", bg: "rgba(154, 166, 168, 0.1)" };
        return { color: "#FFCC00", bg: "rgba(255, 204, 0, 0.1)" }; // Default for Open
    };

    // ฟังก์ชันช่วยจัดการสีและไอคอนตามการ Verify
    const getVerifyBadge = (verify: string) => {
        const v = verify?.toLowerCase();
        if (v === 'tp') return { label: "TP", color: "#8FFF9C", icon: <TPIcon sx={{ fontSize: 12 }} /> };
        if (v === 'fp') return { label: "FP", color: "#FE3B46", icon: <FPIcon sx={{ fontSize: 12 }} /> };
        return { label: "TF", color: "#404F57", icon: <PendingIcon sx={{ fontSize: 12 }} /> }; // Waiting
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const handleRowClick = (id: number) => {
        router.push(`/projects/${projectId}/triage/${id}`);
    };

    const handleSubLinkClick = (e: React.MouseEvent, path: string) => {
        e.stopPropagation();
        router.push(path);
    };

    return (
        <TableContainer
            component={Paper}
            sx={{
                bgcolor: "#0f1518",
                borderRadius: "20px",
                border: "2px solid #404F57",
                borderBottom: "none",
                overflowX: 'auto',
                boxShadow: "none",
                width: "100%",
                zIndex: 2,
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-track': { background: '#0f1518' },
                '&::-webkit-scrollbar-thumb': { background: '#404F57', borderRadius: 4 },
            }}
        >
            <Table sx={{ minWidth: 1100 }}>
                <TableHead sx={{ bgcolor: "#0B0F12" }}>
                    <TableRow>
                        <TableCell sx={{ color: "#404F57", borderBottom: '0px', fontSize: "12px", fontWeight: 'bold', textTransform: 'uppercase', py: 2, textAlign: 'center' }}>Severity</TableCell>
                        <TableCell sx={{ color: "#404F57", borderBottom: '0px', fontSize: "12px", fontWeight: 'bold', textTransform: 'uppercase', py: 2 }}>Issue Detail</TableCell>
                        <TableCell sx={{ color: "#404F57", borderBottom: '0px', fontSize: "12px", fontWeight: 'bold', textTransform: 'uppercase', py: 2 }}>Asset</TableCell>
                        <TableCell sx={{ color: "#404F57", borderBottom: '0px', fontSize: "12px", fontWeight: 'bold', textTransform: 'uppercase', py: 2 }}>Status & Verify</TableCell>
                        <TableCell sx={{ color: "#404F57", borderBottom: '0px', fontSize: "12px", fontWeight: 'bold', textTransform: 'uppercase', py: 2 }}>Assigned To</TableCell>
                        <TableCell sx={{ color: "#404F57", borderBottom: '0px', fontSize: "12px", fontWeight: 'bold', textTransform: 'uppercase', py: 2 }}>Verified By</TableCell>
                        <TableCell sx={{ color: "#404F57", borderBottom: '0px', fontSize: "12px", fontWeight: 'bold', textTransform: 'uppercase', py: 2, minWidth: '120px' }}>First Seen</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {issues.length > 0 ? (
                        issues.map((issue) => {
                            const statusStyles = getStatusStyles(issue.status);
                            const verifyBadge = getVerifyBadge(issue.verify || 'tf');

                            return (
                                <TableRow
                                    key={issue.id}
                                    onClick={() => handleRowClick(issue.id)}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: "0.2s",
                                        "&:hover": {
                                            bgcolor: "rgba(143, 255, 156, 0.04)",
                                            "& .title-text": { color: "#8FFF9C" }
                                        }
                                    }}
                                >
                                    <TableCell sx={{ borderBottom: "1px solid rgba(64, 79, 87, 0.2)", py: 2.5 }}>
                                        <div className="flex flex-col justify-center items-center gap-2">
                                            <Chip
                                                label={issue.severity}
                                                size="small"
                                                sx={{
                                                    bgcolor: `${getSeverityColor(issue.severity)}15`,
                                                    color: getSeverityColor(issue.severity),
                                                    fontWeight: 900, borderRadius: "6px", fontSize: '10px',
                                                    textTransform: 'uppercase', border: `1px solid ${getSeverityColor(issue.severity)}30`, mb: 0.5
                                                }}
                                            />
                                            <Typography sx={{ color: "#9AA6A8", fontSize: '11px', fontWeight: 600, ml: 0.5 }}>
                                                CVSS {issue.cvss_details?.score ?? "N/A"}
                                            </Typography>
                                        </div>
                                    </TableCell>

                                    <TableCell sx={{ borderBottom: "1px solid rgba(64, 79, 87, 0.2)" }}>
                                        <Typography className="title-text" sx={{ color: "#FBFBFB", fontWeight: 700, fontSize: '14px', transition: "0.2s", mb: 0.5 }}>
                                            {issue.title}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#404F57", display: 'block', fontFamily: 'monospace', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {issue.reproduce_info?.target ?? "N/A"}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ borderBottom: "1px solid rgba(64, 79, 87, 0.2)", minWidth: "120px" }}>
                                        <Box
                                            onClick={(e) => handleSubLinkClick(e, `/projects/${projectId}/asset/${issue.asset_id}`)}
                                            sx={{ color: "#8FFF9C", "&:hover": { textDecoration: 'underline' } }}
                                        >
                                            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
                                                {issue.asset_name}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ borderBottom: "1px solid rgba(64, 79, 87, 0.2)", minWidth: "150px"  }}>
                                        <div className="flex flex-col justify-center items-center gap-2">
                                            {/* Status Chip */}
                                            <Box sx={{
                                                display: 'inline-flex', px: 1.2, py: 0.4, borderRadius: '6px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
                                                bgcolor: statusStyles.bg,
                                                color: statusStyles.color,
                                                border: `1px solid ${statusStyles.color}30`,
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {issue.status.replace('_', ' ')}
                                            </Box>

                                            {/* Verify Indicator Mini-Badge */}
                                            <Tooltip title={`Verification: ${verifyBadge.label === 'TP' ? 'True Positive' : verifyBadge.label === 'FP' ? 'False Positive' : 'Wait for Verify'}`}>
                                                <Box sx={{
                                                    display: 'flex', alignItems: 'center', gap: 0.5, color: verifyBadge.color, fontSize: '10px', fontWeight: 400, letterSpacing: '0.1em'
                                                }}>
                                                    {verifyBadge.icon}
                                                    {verifyBadge.label === 'TP' ? 'True Positive' : verifyBadge.label === 'FP' ? 'False Positive' : 'Wait for Verify'}
                                                </Box>
                                            </Tooltip>
                                        </div>
                                    </TableCell>

                                    <TableCell sx={{ borderBottom: "1px solid rgba(64, 79, 87, 0.2)", maxWidth: '150px' }}>
                                        {issue.assigned_to ? (
                                            <Box
                                                onClick={(e) => handleSubLinkClick(e, `/profile/${issue.assigned_to}`)}
                                                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                            >
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '11px', bgcolor: 'rgba(143, 255, 156, 0.1)', color: '#8FFF9C', border: '1px solid rgba(143, 255, 156, 0.2)' }}>
                                                    {issue.assigned_to.charAt(0).toUpperCase()} 
                                                    {/* Change to real pic later */}
                                                </Avatar>
                                                <UsernameDisplay
                                                    userId={issue.assigned_to}
                                                    onClick={(e) => handleSubLinkClick(e, `/profile/${issue.assigned_to}`)}
                                                />
                                            </Box>
                                        ) : (
                                            <Typography sx={{ color: "#404F57", fontSize: '13px' }}>-</Typography>
                                        )}
                                    </TableCell>

                                    <TableCell sx={{ borderBottom: "1px solid rgba(64, 79, 87, 0.2)", maxWidth: '150px' }}>
                                        {issue.verified_by ? (
                                            <Box
                                                onClick={(e) => handleSubLinkClick(e, `/profile/${issue.verified_by}`)}
                                                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                            >
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '11px', bgcolor: 'rgba(64, 79, 87, 0.3)', color: '#9AA6A8', border: '1px solid rgba(154, 166, 168, 0.2)' }}>
                                                    {issue.verified_by.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <UsernameDisplay
                                                    userId={issue.verified_by}
                                                    color="#9AA6A8"
                                                    onClick={(e) => handleSubLinkClick(e, `/profile/${issue.verified_by}`)}
                                                />
                                            </Box>
                                        ) : (
                                            <Typography sx={{ color: "#404F57", fontSize: '12px' }}>-</Typography>
                                        )}
                                    </TableCell>

                                    <TableCell sx={{
                                        borderBottom: "1px solid rgba(64, 79, 87, 0.2)",
                                        color: "#9AA6A8",
                                        fontSize: '13px',
                                        whiteSpace: 'nowrap',
                                        minWidth: '120px'
                                    }}>
                                        {formatDate(issue.dates?.first_seen)}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 10, color: "#404F57", border: "none" }}>
                                <Typography sx={{ fontWeight: 600, opacity: 0.5 }}>No vulnerabilities found.</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
