"use client";

import { 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Typography, Chip, Box, Avatar
} from "@mui/material";
import { useRouter } from "next/navigation";
import { UsernameDisplay } from "../users/UsernameDisplay";
import { VulnIssue } from "@/src/types/vuln";

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

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const handleRowClick = (id: number) => {
        router.push(`/projects/${projectId}/vulns/${id}`);
    };

    const handleSubLinkClick = (e: React.MouseEvent, path: string) => {
        e.stopPropagation(); 
        router.push(path);
    };

    return (
        <TableContainer 
            component={Paper} 
            sx={{ 
                bgcolor: "#1E2429", 
                borderRadius: "20px", 
                border: "1px solid #404F57", 
                overflow: 'hidden',
                boxShadow: "none"
            }}
        >
            <Table sx={{ minWidth: 1100 }}> 
                <TableHead sx={{ bgcolor: "#0B0F12" }}>
                    <TableRow>
                        <TableCell sx={{ color: "#9AA6A8", fontSize: "11px", fontWeight: 800, textTransform: 'uppercase', borderBottom: "1px solid #404F57", py: 2 }}>Severity</TableCell>
                        <TableCell sx={{ color: "#9AA6A8", fontSize: "11px", fontWeight: 800, textTransform: 'uppercase', borderBottom: "1px solid #404F57", py: 2 }}>Issue Detail</TableCell>
                        <TableCell sx={{ color: "#9AA6A8", fontSize: "11px", fontWeight: 800, textTransform: 'uppercase', borderBottom: "1px solid #404F57", py: 2 }}>Asset</TableCell>
                        <TableCell sx={{ color: "#9AA6A8", fontSize: "11px", fontWeight: 800, textTransform: 'uppercase', borderBottom: "1px solid #404F57", py: 2 }}>Status</TableCell>
                        <TableCell sx={{ color: "#9AA6A8", fontSize: "11px", fontWeight: 800, textTransform: 'uppercase', borderBottom: "1px solid #404F57", py: 2 }}>Assigned To</TableCell>
                        <TableCell sx={{ color: "#9AA6A8", fontSize: "11px", fontWeight: 800, textTransform: 'uppercase', borderBottom: "1px solid #404F57", py: 2 }}>Verified By</TableCell>
                        {/* กำหนดความกว้างขั้นต่ำให้คอลัมน์วันที่ */}
                        <TableCell sx={{ color: "#9AA6A8", fontSize: "11px", fontWeight: 800, textTransform: 'uppercase', borderBottom: "1px solid #404F57", py: 2, minWidth: '120px' }}>First Seen</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {issues.length > 0 ? (
                        issues.map((issue) => (
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
                                    <Box>
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
                                    </Box>
                                </TableCell>

                                <TableCell sx={{ borderBottom: "1px solid rgba(64, 79, 87, 0.2)" }}>
                                    <Typography className="title-text" sx={{ color: "#FBFBFB", fontWeight: 700, fontSize: '14px', transition: "0.2s", mb: 0.5 }}>
                                        {issue.title}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#404F57", display: 'block', fontFamily: 'monospace', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {issue.reproduce_info?.target ?? "N/A"}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ borderBottom: "1px solid rgba(64, 79, 87, 0.2)" }}>
                                    <Box 
                                        onClick={(e) => handleSubLinkClick(e, `/projects/${projectId}/assets/${issue.asset_id}`)}
                                        sx={{ color: "#8FFF9C", "&:hover": { textDecoration: 'underline' } }}
                                    >
                                        <Typography sx={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                            {issue.asset_name}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                <TableCell sx={{ borderBottom: "1px solid rgba(64, 79, 87, 0.2)" }}>
                                    <Box sx={{ 
                                        display: 'inline-flex', px: 1.5, py: 0.5, borderRadius: '8px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
                                        bgcolor: issue.status === "fixed" ? "rgba(143, 255, 156, 0.1)" : "rgba(255, 204, 0, 0.1)",
                                        color: issue.status === "fixed" ? "#8FFF9C" : "#FFCC00",
                                        border: `1px solid ${issue.status === "fixed" ? "rgba(143, 255, 156, 0.2)" : "rgba(255, 204, 0, 0.2)"}`,
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {issue.status}
                                    </Box>
                                </TableCell>

                                <TableCell sx={{ borderBottom: "1px solid rgba(64, 79, 87, 0.2)" }}>
                                    {issue.assigned_to ? (
                                        <Box 
                                            onClick={(e) => handleSubLinkClick(e, `/profile/${issue.assigned_to}`)}
                                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                        >
                                            <Avatar sx={{ width: 24, height: 24, fontSize: '11px', bgcolor: 'rgba(143, 255, 156, 0.1)', color: '#8FFF9C', border: '1px solid rgba(143, 255, 156, 0.2)' }}>
                                                {issue.assigned_to.charAt(0).toUpperCase()}
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

                                <TableCell sx={{ borderBottom: "1px solid rgba(64, 79, 87, 0.2)" }}>
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

                                {/* ปรับปรุงคอลัมน์วันที่ให้แสดงผลบรรทัดเดียวเสมอ */}
                                <TableCell sx={{ 
                                    borderBottom: "1px solid rgba(64, 79, 87, 0.2)", 
                                    color: "#9AA6A8", 
                                    fontSize: '13px',
                                    whiteSpace: 'nowrap', // ห้ามตัดบรรทัด
                                    minWidth: '120px'     // การันตีพื้นที่ให้วันที่
                                }}>
                                    {formatDate(issue.dates?.first_seen)}
                                </TableCell>
                            </TableRow>
                        ))
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