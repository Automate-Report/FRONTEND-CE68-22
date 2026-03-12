"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box, Typography, Stack, Chip, Divider,
  Select, MenuItem, CircularProgress, Tabs, Tab,
  FormControl, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import {
  Description as InfoIcon,
  Build as FixIcon,
  History as LogIcon,
  Visibility as EvidenceIcon,
  CheckCircle as TPIcon,
  Cancel as FPIcon,
  HelpOutline as PendingIcon,
  WarningAmber as WarningIcon,
  CheckCircleOutline as SuccessIcon,
  HourglassEmpty as WaitIcon
} from "@mui/icons-material";

// Hooks
import { useVuln } from "@/src/hooks/vuln/use-vuln";
import { useMembers } from "@/src/hooks/project/use-members";
import { useProject } from "@/src/hooks/project/use-project";
import { useAssignVuln } from "@/src/hooks/vuln/use-assignVuln";
import { useUpdateStatus } from "@/src/hooks/vuln/use-updateStatus";
import { useUpdateVerify } from "@/src/hooks/vuln/use-updateVerify";
import { refresh } from "next/cache";

export default function VulnDetailPage() {
  const params = useParams();
  const vulnId = parseInt(params.vulnId as string);
  const projectId = parseInt(params.id as string);

  const [activeTab, setActiveTab] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [pendingVerify, setPendingVerify] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // --- 1. Data Fetching ---
  const { data: vuln, isLoading: isVulnLoading, isError } = useVuln(vulnId, projectId);
  const { data: membersData, isLoading: isMembersLoading } = useMembers(
    projectId, 1, 100, "firstname", "asc", "", "ALL"
  );
  const { data: project } = useProject(projectId);

  // --- 2. Mutations ---
  const { mutate: assignVuln, isPending: isAssigning } = useAssignVuln(vulnId, projectId);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateStatus(vulnId, projectId);
  const { mutate: updateVerify, isPending: isUpdatingVerify } = useUpdateVerify(vulnId, projectId);

  // --- 3. Permissions Logic ---
  const myRole = project?.role?.toLowerCase();
  const canChangeStatus = myRole === "owner" || myRole === "developer";
  const canVerify = myRole === "owner" || myRole === "pentester";
  const assignRole = myRole === "owner";

  const members = membersData?.items || [];

  // --- 4. Handlers ---
  const handleAssignChange = (position: "assigned_to" | "verified_by", userId: string) => {
    assignVuln({ position, user_id: userId });
  };

  const handleStatusChange = (newStatus: string) => {
    updateStatus(newStatus);
    window.location.reload()
  };

  const handleVerifyChange = (newVerify: string) => {
    // เปิด Dialog สำหรับทุกสถานะเพื่อความชัดเจนในการเปลี่ยน Status อัตโนมัติ
    setPendingVerify(newVerify);
    setOpenConfirm(true);
  };

  const executeVerifyUpdate = (value: string) => {
    updateVerify(value, {
      onSuccess: () => {
        // ✅ Logic อัตโนมัติ: 
        // FP -> Won't Fix
        // TP หรือ TF (Wait) -> Open
        if (value === "fp") {
          handleStatusChange("wont_fix");
        } else {
          handleStatusChange("open");
        }
        queryClient.invalidateQueries({ queryKey: ["vulns", vulnId] });
      }
    });
    setOpenConfirm(false);
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'fixed') return { bg: "#8FFF9C", text: "#0D1014" };
    if (s === 'in_progress') return { bg: "#007AFF", text: "#FFFFFF" };
    if (s === 'open') return { bg: "#FE3B46", text: "#FFFFFF" };
    if (s === 'fp' || s === 'wont_fix') return { bg: "#404F57", text: "#FFFFFF" };
    return { bg: "#1E2429", text: "#9AA6A8" };
  };

  if (isVulnLoading || isMembersLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
      <CircularProgress sx={{ color: "#8FFF9C" }} />
    </Box>
  );

  if (isError || !vuln) return (
    <Box sx={{ p: 10, textAlign: 'center' }}><Typography color="error" sx={{ fontWeight: 800 }}>Vulnerability Not Found</Typography></Box>
  );

  const statusStyle = getStatusColor(vuln.status);

  return (
    <Box className="bg-[#161B1F] rounded-2xl border-[2px] border-[#2D2F39] overflow-hidden flex flex-col h-full animate-in fade-in duration-500 shadow-2xl">

      {/* Header Section */}
      <Box p={4} pb={3} bgcolor="#1E2429" borderBottom="1px solid #2D2F39">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Stack direction="row" spacing={1} mb={1.5} alignItems="center">
              <Chip label={vuln.severity.toUpperCase()} size="small" sx={{ p: 1, bgcolor: `${vuln.severity === 'critical' ? '#FE3B46' : '#FF9500'}20`, color: vuln.severity === 'critical' ? '#FE3B46' : '#FF9500', fontWeight: 700, fontSize: '12px' }} />
              <Chip label={vuln.asset_name} size="small" sx={{ p: 1, bgcolor: "#272D31", color: "#8FFF9C", fontWeight: 700, fontSize: '12px', border: '1px solid #404F57' }} />
            </Stack>
            <div className="w-full flex flex-col mb-6">
              <h1 className="font-bold text-[28px]">
                {vuln.title}
              </h1>
            </div>

            <Typography variant="caption" sx={{ color: "#667a85", fontWeight: 700, display: 'block', mb: 1 }}>Verification Status</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl size="small" sx={{ width: 150 }}>
                <Tooltip title={!canVerify ? "Only Owners or Pentesters can verify vulnerabilities" : ""}>
                  <Select
                    value={vuln.verify || "tf"}
                    disabled={!canVerify || isUpdatingVerify}
                    onChange={(e) => handleVerifyChange(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: '#0F1518',
                          border: '1px solid #404F57',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                          maxHeight: 192,
                          mt: 0.5,
                          '& .MuiList-root': { padding: 0 },
                        },
                      },
                    }}
                    sx={{
                      height: 28, fontSize: '12px', fontWeight: 500, borderRadius: '8px',
                      bgcolor: vuln.verify === "tp" ? 'rgba(143, 255, 156, 0.05)' : vuln.verify === "fp" ? 'rgba(254, 59, 70, 0.05)' : '#272D31',
                      color: vuln.verify === "tp" ? '#8FFF9C' : vuln.verify === "fp" ? '#FE3B46' : '#9AA6A8',
                      border: `1px solid ${vuln.verify === "tp" ? '#8FFF9C30' : vuln.verify === "fp" ? '#FE3B4630' : '#404F57'}`,
                      ".MuiOutlinedInput-notchedOutline": { border: "none" },
                      "& .MuiSelect-icon": { fontSize: 16, color: 'inherit' }
                    }}
                  >
                    <MenuItem value="tf" sx={{
                      fontSize: '13px', fontWeight: 600, width: 150,
                      color: '#E6F0E6', borderRadius: '12px', height: 42, pl: 1.5,
                      '&:hover': { bgcolor: '#1D2226' },
                      '&.Mui-selected': { bgcolor: '#2D353B', '&:hover': { bgcolor: '#2D353B' } },
                    }}>Waiting For Verify</MenuItem>

                    <MenuItem value="tp" sx={{
                      fontSize: '13px', fontWeight: 600, width: 150,
                      color: '#8FFF9C', borderRadius: '12px', height: 42, pl: 1.5,
                      '&:hover': { bgcolor: '#1D2226' },
                      '&.Mui-selected': { bgcolor: '#2D353B', '&:hover': { bgcolor: '#2D353B' } },
                    }}>True Positive</MenuItem>

                    <MenuItem value="fp" sx={{
                      fontSize: '13px', fontWeight: 600, width: 150,
                      color: '#FE3B46', borderRadius: '12px', height: 42, pl: 1.5,
                      '&:hover': { bgcolor: '#1D2226' },
                      '&.Mui-selected': { bgcolor: '#2D353B', '&:hover': { bgcolor: '#2D353B' } },
                    }}>False Positive</MenuItem>
                  </Select>
                </Tooltip>
              </FormControl>
            </Stack>
          </Box>

          <FormControl>
            <Tooltip title={!canChangeStatus ? "Only Owners or Developers can modify status" : ""}>
              <span>
                <Typography variant="caption" sx={{ color: "#667a85", fontWeight: 700, display: 'block', mb: 1 }}>Issue Status</Typography>
                <Select
                  value={vuln.status}
                  disabled={!canChangeStatus || isUpdatingStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#0F1518',
                        border: '1px solid #404F57',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        maxHeight: 192,
                        mt: 0.5,
                        '& .MuiList-root': { padding: 0 },
                      },
                    },
                  }}
                  sx={{
                    minWidth: 160, bgcolor: statusStyle.bg, color: statusStyle.text, fontWeight: 700, borderRadius: '8px',
                    ".MuiOutlinedInput-notchedOutline": { border: "none" }, height: 40, fontSize: '13px', opacity: canChangeStatus ? 1 : 0.6
                  }}>
                  <MenuItem value="open" sx={{
                    fontSize: '13px', fontWeight: 600,
                    color: '#E6F0E6', borderRadius: '12px', height: 42, pl: 1.5,
                    '&:hover': { bgcolor: '#1D2226' },
                    '&.Mui-selected': { bgcolor: '#2D353B', '&:hover': { bgcolor: '#2D353B' } },
                  }}>OPEN</MenuItem>
                  <MenuItem value="in_progress" sx={{
                    fontSize: '13px', fontWeight: 600,
                    color: '#E6F0E6', borderRadius: '12px', height: 42, pl: 1.5,
                    '&:hover': { bgcolor: '#1D2226' },
                    '&.Mui-selected': { bgcolor: '#2D353B', '&:hover': { bgcolor: '#2D353B' } },
                  }}>IN PROGRESS</MenuItem>
                  <MenuItem value="fixed" sx={{
                    fontSize: '13px', fontWeight: 600,
                    color: '#E6F0E6', borderRadius: '12px', height: 42, pl: 1.5,
                    '&:hover': { bgcolor: '#1D2226' },
                    '&.Mui-selected': { bgcolor: '#2D353B', '&:hover': { bgcolor: '#2D353B' } },
                  }}>FIXED</MenuItem>
                  <MenuItem value="wont_fix" sx={{
                    fontSize: '13px', fontWeight: 600,
                    color: '#E6F0E6', borderRadius: '12px', height: 42, pl: 1.5,
                    '&:hover': { bgcolor: '#1D2226' },
                    '&.Mui-selected': { bgcolor: '#2D353B', '&:hover': { bgcolor: '#2D353B' } },
                  }}>WON'T FIX</MenuItem>
                </Select>
              </span>
            </Tooltip>
          </FormControl>
        </Stack>

        <Divider sx={{ borderColor: "#2D2F39", my: 2, opacity: 0.7 }} />

        <Stack direction="row" spacing={3}>
          <Box flex={1}>
            <Typography variant="caption" sx={{ color: "#667a85", fontWeight: 700, display: 'block', mb: 1 }}>Assign To (Dev/Owner)</Typography>
            {assignRole ? (
              <Select fullWidth size="small"
                value={vuln.assigned_to || ""} displayEmpty
                disabled={isAssigning}
                onChange={(e) => handleAssignChange("assigned_to", e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: '#0F1518',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                      maxHeight: 192,
                      mt: 0.5,
                      '& .MuiList-root': { padding: 0 },
                    },
                  },
                }}
                sx={{ bgcolor: "#0D1014", color: "#E6F0E6", borderRadius: '8px', fontSize: '13px', "& .MuiSelect-icon": { fontSize: 16, color: 'inherit' }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" } }}>
                <MenuItem value="" sx={{
                  fontSize: '13px', fontWeight: 500,
                  color: '#E6F0E6', borderRadius: '12px', height: 42, pl: 1.5,
                  '&:hover': { bgcolor: '#1D2226' },
                  '&.Mui-selected': { bgcolor: '#2D353B', '&:hover': { bgcolor: '#2D353B' } },
                }}><em>Unassigned</em></MenuItem>
                {members.filter(m => m.role.toLowerCase() === 'developer' || m.role.toLowerCase() === 'owner').map((m) => (
                  <MenuItem key={m.email} value={m.email} sx={{
                    fontSize: '13px', fontWeight: 500,
                    color: '#E6F0E6', borderRadius: '12px', height: 42, pl: 1.5,
                    '&:hover': { bgcolor: '#1D2226' },
                    '&.Mui-selected': { bgcolor: '#2D353B', '&:hover': { bgcolor: '#2D353B' } },
                  }}>{m.firstname} {m.lastname} ({m.role})</MenuItem>
                ))}
              </Select>
            ) : (
              <Typography sx={{ color: vuln.assigned_to ? "#E6F0E6" : "#404F57", fontWeight: 700 }}>{vuln.assigned_to ? members.find(m => m.email === vuln.assigned_to)?.firstname + " " + members.find(m => m.email === vuln.assigned_to)?.lastname + " (" + members.find(m => m.email === vuln.assigned_to)?.role + ")" : "Unassigned"}</Typography>
            )}
          </Box>
          <Box flex={1}>
            <Typography variant="caption" sx={{ color: "#667a85", fontWeight: 700, display: 'block', mb: 1 }}>Verified By (Pentester/Owner)</Typography>
            {assignRole ? (
              <Select fullWidth size="small" value={vuln.verified_by || ""} displayEmpty disabled={isAssigning} onChange={(e) => handleAssignChange("verified_by", e.target.value)} MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#0F1518',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    maxHeight: 192,
                    mt: 0.5,
                    '& .MuiList-root': { padding: 0 },
                  },
                },
              }}
                sx={{ bgcolor: "#0D1014", color: "#E6F0E6", borderRadius: '8px', fontSize: '13px', "& .MuiSelect-icon": { fontSize: 16, color: 'inherit' }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" } }}>
                <MenuItem value="" sx={{
                  fontSize: '13px', fontWeight: 500,
                  color: '#E6F0E6', borderRadius: '12px', height: 42, pl: 1.5,
                  '&:hover': { bgcolor: '#1D2226' },
                  '&.Mui-selected': { bgcolor: '#2D353B', '&:hover': { bgcolor: '#2D353B' } },
                }}><em>Not Verified</em></MenuItem>
                {members.filter(m => m.role.toLowerCase() === 'pentester' || m.role.toLowerCase() === 'owner').map((m) => (
                  <MenuItem key={m.email} value={m.email} sx={{
                    fontSize: '13px', fontWeight: 500,
                    color: '#E6F0E6', borderRadius: '12px', height: 42, pl: 1.5,
                    '&:hover': { bgcolor: '#1D2226' },
                    '&.Mui-selected': { bgcolor: '#2D353B', '&:hover': { bgcolor: '#2D353B' } },
                  }}>{m.firstname} {m.lastname} ({m.role})</MenuItem>
                ))}
              </Select>
            ) : (
              <Typography sx={{ color: vuln.verified_by ? "#FBFBFB" : "#404F57", fontWeight: 700 }}>{vuln.verified_by ? members.find(m => m.email === vuln.verified_by)?.firstname + " " + members.find(m => m.email === vuln.verified_by)?.lastname + " (" + members.find(m => m.email === vuln.verified_by)?.role + ")" : "Not Verified"}</Typography>
            )}

          </Box>
        </Stack>
      </Box>

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: '#2D2F39', bgcolor: '#161B1F' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
          variant="fullWidth"
          sx={{
            minHeight: 52,
            height: 52,
            '& .MuiTab-root': { color: '#404F57', fontWeight: 500, minHeight: 52, height: 52, py: 2 },
            '& .Mui-selected': { color: '#8FFF9C !important' },
            '& .MuiTabs-indicator': { bgcolor: '#8FFF9C' }
          }}>
          <Tab icon={<EvidenceIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Evidence" sx={{ fontSize: 14, textTransform: 'none' }} />
          <Tab icon={<FixIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Remediation" sx={{ fontSize: 14, textTransform: 'none' }} />
          <Tab icon={<InfoIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Details" sx={{ fontSize: 14, textTransform: 'none' }} />
          <Tab icon={<LogIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Timeline" sx={{ fontSize: 14, textTransform: 'none' }} />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box p={4} py={3} sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: "#111518" }}>
        {activeTab === 0 && (
          <Stack spacing={4} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Box>
              <Typography sx={{ color: "#E6F0E6", mb: 2, fontWeight: 600, fontSize: 18 }}>Screenshot Proof</Typography>
              {vuln.evidence?.screenshot ? (
                <Box component="img" src={vuln.evidence.screenshot.startsWith('data:') ?
                  vuln.evidence.screenshot : "https://img.freepik.com/free-vector/night-landscape-with-lake-mountains-trees-coast-vector-cartoon-illustration-nature-scene-with-coniferous-forest-river-shore-rocks-moon-stars-dark-sky_107791-8253.jpg?semt=ais_rp_progressive&w=740&q=80"}
                  sx={{ width: '100%', borderRadius: '12px', border: '2px solid #2D2F39' }} />
              ) : <Box sx={{ p: 6, bgcolor: '#0D1014', textAlign: 'center', borderRadius: '12px', color: '#404F57', border: '1px dashed #2D2F39' }}>No evidence image provided</Box>}
            </Box>
            <Box>
              <Typography sx={{ color: "#E6F0E6", mb: 2, fontWeight: 600, fontSize: 18 }}>Reproduction cURL</Typography>
              <pre className="bg-[#0D1014] p-5 rounded-xl border border-[#2D2F39] overflow-x-auto text-[#FFCC00] text-[13px] font-mono leading-relaxed">
                {vuln.reproduce_info?.curl_command || "# No reproduction command"}
              </pre>
            </Box>
          </Stack>
        )}

        {activeTab === 1 && (
          <Box className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Typography sx={{ color: "#E6F0E6", mb: 2, fontWeight: 600, fontSize: 18 }}>Fix Recommendation</Typography>
            <Box sx={{ bgcolor: "#1E2429", p: 3, borderRadius: "12px", borderLeft: "4px solid #8FFF9C" }}>
              <Typography sx={{ color: "#E6F0E6", whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {vuln.recommendation || "No recommendation available."}
              </Typography>
            </Box>
          </Box>
        )}

        {activeTab === 2 && (
          <Stack spacing={3} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Box>
              <Typography sx={{ color: "#E6F0E6", mb: 2, fontWeight: 600, fontSize: 18 }}>Vulnerability Description</Typography>
              <Typography sx={{ color: "#9AA6A8", lineHeight: 1.7 }}>{vuln.description || "N/A"}</Typography>
            </Box>
            <Divider sx={{ borderColor: "#2D2F39" }} />
            <Box>
              <Typography sx={{ color: "#E6F0E6", mb: 2, fontWeight: 600, fontSize: 18 }}>Vulnerability Parameter</Typography>
              <TableContainer
                sx={{
                  bgcolor: "#0f1518",
                  borderRadius: "20px",
                  border: "2px solid rgba(64,79,87,0.4)",
                  overflowX: 'auto',
                  boxShadow: "none",
                  width: "100%",
                  zIndex: 2,
                  '&::-webkit-scrollbar': { height: 4 },
                  '&::-webkit-scrollbar-track': { background: '#0f1518' },
                  '&::-webkit-scrollbar-thumb': { background: '#404F57', borderRadius: 4 },
                }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#0B0F12" }}>
                    <TableRow>
                      <TableCell sx={{ color: "#404F57", borderBottom: '0px', fontSize: "12px", fontWeight: 'bold', textTransform: 'uppercase', py: 2, pl: 3 }}>Severity</TableCell>
                      <TableCell sx={{ color: "#404F57", borderBottom: '0px', fontSize: "12px", fontWeight: 'bold', textTransform: 'uppercase', py: 2 }}>Issue Detail</TableCell>
                      <TableCell sx={{ color: "#404F57", borderBottom: '0px', fontSize: "12px", fontWeight: 'bold', textTransform: 'uppercase', py: 2, minWidth: '120px' }}>First Seen</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ color: "#E6F0E6", borderBottom: '0px', fontWeight: 500, pl: 3 }}>{vuln.vuln_type || "N/A"}</TableCell>
                      <TableCell sx={{ color: "#E6F0E6", borderBottom: '0px', fontWeight: 500 }}>{vuln.reproduce_info?.method || "GET"}</TableCell>
                      <TableCell sx={{ color: "#E6F0E6", borderBottom: '0px', fontWeight: 500, wordBreak: 'break-all' }}>{vuln.parameters || "N/A"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Stack>
        )}

        {activeTab === 3 && (
          <Box className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Typography sx={{ color: "#E6F0E6", mb: 2, fontWeight: 600, fontSize: 18 }}>Detection Timeline ({vuln.occurrence_count} Occurrences)</Typography>
            <Stack spacing={0} sx={{ position: 'relative', ml: 1 }}>
              <Box sx={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: '2px', bgcolor: '#2D2F39' }} />
              <Box sx={{ position: 'relative', pl: 5, mb: 2.5, mt: 1 }}>
                <Box sx={{ position: 'absolute', left: 0, top: '40%', width: 16, height: 16, borderRadius: '50%', bgcolor: '#8FFF9C', border: `4px solid #111518`, zIndex: 1 }} />
                <Box sx={{ p: 2, bgcolor: 'rgba(143, 255, 156, 0.05)', borderRadius: '12px', border: '2px solid rgba(143, 255, 156, 0.2)' }}>
                  <Typography sx={{ color: "#8FFF9C", fontWeight: 700, fontSize: 14 }}>Last Detected</Typography>
                  <Typography sx={{ color: "#FBFBFB", fontSize: '14px', fontWeight: 700 }}>{new Date(vuln.dates.last_seen).toLocaleString('en-GB')}</Typography>
                </Box>
              </Box>
              {vuln.occurrence_date.slice(1).map((date, i) => (
                <Box key={i} sx={{ position: 'relative', pl: 5, mb: 2.5 }}>
                  <Box sx={{ position: 'absolute', left: 0, top: '40%', width: 16, height: 16, borderRadius: '50%', bgcolor: '#404F57', border: `4px solid #111518`, zIndex: 1 }} />
                  <Box sx={{ p: 2, bgcolor: '#0f1518', borderRadius: '12px', border: '2px solid #2D2F39' }}>
                    {/* ลำดับครั้งจะลบ i+1 เพราะเราข้ามตัวแรกไป */}
                    <Typography sx={{ color: "#FBFBFB", fontWeight: 500, fontSize: 14 }}>
                      Detection #{vuln.occurrence_count - (i + 1)}
                    </Typography>
                    <Typography sx={{ color: "#6c7d86", fontSize: '14px', fontWeight: 500 }}>
                      {new Date(date).toLocaleString('en-GB')}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {/* ✅ DYNAMIC CONFIRM DIALOG */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        PaperProps={{ sx: { bgcolor: '#1E2429', color: '#FBFBFB', borderRadius: '16px', border: '1px solid #2D2F39' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 900 }}>
          {pendingVerify === "tp" && <SuccessIcon sx={{ color: '#8FFF9C' }} />}
          {pendingVerify === "fp" && <WarningIcon sx={{ color: '#FF9500' }} />}
          {pendingVerify === "tf" && <WaitIcon sx={{ color: '#9AA6A8' }} />}
          Confirm {pendingVerify === "tp" ? "True Positive" : pendingVerify === "fp" ? "False Positive" : "Wait for Verify"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#9AA6A8', fontWeight: 500 }}>
            {pendingVerify === "fp" ? (
              <>Marking this as a <b>False Positive</b> will automatically set the status to <b>Won't Fix</b>.</>
            ) : (
              <>This will automatically reset the vulnerability status to <b>OPEN</b> for remediation. Proceed?</>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenConfirm(false)} sx={{ color: '#FBFBFB', fontWeight: 700 }}>Cancel</Button>
          <Button
            variant="contained"
            color={pendingVerify === "tp" ? "success" : pendingVerify === "fp" ? "warning" : "inherit"}
            onClick={() => pendingVerify && executeVerifyUpdate(pendingVerify)}
            sx={{ borderRadius: '8px', fontWeight: 800, px: 3, bgcolor: pendingVerify === "tf" ? "#404F57" : undefined }}
          >
            Confirm & Change
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}