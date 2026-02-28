"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Box, Typography, Stack, Chip, Divider, 
  Select, MenuItem, CircularProgress, Tabs, Tab, 
  FormControl, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions, Button 
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
    <Box className="bg-[#161B1F] rounded-2xl border border-[#2D2F39] overflow-hidden flex flex-col h-full animate-in fade-in duration-500 shadow-2xl">
      
      {/* Header Section */}
      <Box p={4} bgcolor="#1E2429" borderBottom="1px solid #2D2F39">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Stack direction="row" spacing={1} mb={1.5} alignItems="center">
              <Chip label={vuln.severity.toUpperCase()} size="small" sx={{ bgcolor: `${vuln.severity === 'critical' ? '#FE3B46' : '#FF9500'}20`, color: vuln.severity === 'critical' ? '#FE3B46' : '#FF9500', fontWeight: 900, fontSize: '10px' }} />
              <Chip label={vuln.asset_name} size="small" sx={{ bgcolor: "#272D31", color: "#8FFF9C", fontWeight: 700, fontSize: '10px', border: '1px solid #404F57' }} />
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#FBFBFB", mb: 2, letterSpacing: '-0.02em' }}>{vuln.title}</Typography>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl size="small">
                <Tooltip title={!canVerify ? "Only Owners or Pentesters can verify vulnerabilities" : ""}>
                  <span>
                    <Select
                      value={vuln.verify || "tf"}
                      disabled={!canVerify || isUpdatingVerify}
                      onChange={(e) => handleVerifyChange(e.target.value)}
                      sx={{
                        height: 28, fontSize: '10px', fontWeight: 800, borderRadius: '6px',
                        bgcolor: vuln.verify === "tp" ? 'rgba(143, 255, 156, 0.05)' : vuln.verify === "fp" ? 'rgba(254, 59, 70, 0.05)' : '#272D31',
                        color: vuln.verify === "tp" ? '#8FFF9C' : vuln.verify === "fp" ? '#FE3B46' : '#9AA6A8',
                        border: `1px solid ${vuln.verify === "tp" ? '#8FFF9C30' : vuln.verify === "fp" ? '#FE3B4630' : '#404F57'}`,
                        ".MuiOutlinedInput-notchedOutline": { border: "none" },
                        "& .MuiSelect-icon": { fontSize: 16, color: 'inherit' }
                      }}
                    >
                      <MenuItem value="tf" sx={{ fontSize: '11px', fontWeight: 700 }}>WAITING FOR VERIFICATION</MenuItem>
                      <MenuItem value="tp" sx={{ fontSize: '11px', fontWeight: 700, color: '#8FFF9C' }}>TRUE POSITIVE</MenuItem>
                      <MenuItem value="fp" sx={{ fontSize: '11px', fontWeight: 700, color: '#FE3B46' }}>FALSE POSITIVE</MenuItem>
                    </Select>
                  </span>
                </Tooltip>
              </FormControl>
            </Stack>
          </Box>

          <FormControl size="small">
            <Tooltip title={!canChangeStatus ? "Only Owners or Developers can modify status" : ""}>
              <span>
                <Select value={vuln.status} disabled={!canChangeStatus || isUpdatingStatus} onChange={(e) => handleStatusChange(e.target.value)} sx={{ minWidth: 160, bgcolor: statusStyle.bg, color: statusStyle.text, fontWeight: 900, borderRadius: '8px', ".MuiOutlinedInput-notchedOutline": { border: "none" }, height: 40, fontSize: '13px', opacity: canChangeStatus ? 1 : 0.6 }}>
                    <MenuItem value="open">OPEN</MenuItem>
                    <MenuItem value="in_progress">IN PROGRESS</MenuItem>
                    <MenuItem value="fixed">FIXED</MenuItem>
                    <MenuItem value="wont_fix">WON'T FIX</MenuItem>
                </Select>
              </span>
            </Tooltip>
          </FormControl>
        </Stack>

        <Divider sx={{ borderColor: "#2D2F39", mb: 3, opacity: 0.5 }} />

        <Stack direction="row" spacing={3}>
          <Box flex={1}>
            <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 900, display: 'block', mb: 1, letterSpacing: 1.5 }}>ASSIGNED TO (DEV/OWNER)</Typography>
              {assignRole ? ( 
                <Select fullWidth size="small" value={vuln.assigned_to || ""} displayEmpty disabled={isAssigning} onChange={(e) => handleAssignChange("assigned_to", e.target.value)} sx={{ bgcolor: "#0D1014", color: "#E6F0E6", borderRadius: '8px', ".MuiOutlinedInput-notchedOutline": { borderColor: "#2D2F39" } }}>
                  <MenuItem value=""><em>Unassigned</em></MenuItem>
                  {members.filter(m => m.role.toLowerCase() === 'developer' || m.role.toLowerCase() === 'owner').map((m) => (
                    <MenuItem key={m.email} value={m.email}>{m.firstname} {m.lastname} ({m.role})</MenuItem>
                  ))}
                </Select>
              ) : (
                <Typography sx={{ color: vuln.assigned_to ? "#FBFBFB" : "#404F57", fontWeight: 700 }}>{vuln.assigned_to ? members.find(m => m.email === vuln.assigned_to)?.firstname + " " + members.find(m => m.email === vuln.assigned_to)?.lastname + " (" + members.find(m => m.email === vuln.assigned_to)?.role + ")" : "Unassigned"}</Typography>
              )}
          </Box>
          <Box flex={1}>
            <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 900, display: 'block', mb: 1, letterSpacing: 1.5 }}>VERIFIED BY (PENTESTER/OWNER)</Typography>
            {assignRole ? (
              <Select fullWidth size="small" value={vuln.verified_by || ""} displayEmpty disabled={isAssigning} onChange={(e) => handleAssignChange("verified_by", e.target.value)} sx={{ bgcolor: "#0D1014", color: "#E6F0E6", borderRadius: '8px', ".MuiOutlinedInput-notchedOutline": { borderColor: "#2D2F39" } }}>
                <MenuItem value=""><em>Not Verified</em></MenuItem>
                {members.filter(m => m.role.toLowerCase() === 'pentester' || m.role.toLowerCase() === 'owner').map((m) => (
                  <MenuItem key={m.email} value={m.email}>{m.firstname} {m.lastname} ({m.role})</MenuItem>
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
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ px: 2, '& .MuiTab-root': { color: '#404F57', fontWeight: 800, minHeight: '64px' }, '& .Mui-selected': { color: '#8FFF9C !important' }, '& .MuiTabs-indicator': { bgcolor: '#8FFF9C' } }}>
          <Tab icon={<EvidenceIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Evidence" />
          <Tab icon={<FixIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Remediation" />
          <Tab icon={<InfoIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Details" />
          <Tab icon={<LogIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Timeline" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box p={4} sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: "#111518" }}>
        {activeTab === 0 && (
          <Stack spacing={4} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Box>
                <Typography variant="subtitle2" sx={{ color: "#8FFF9C", mb: 2, fontWeight: 900 }}>SCREENSHOT PROOF</Typography>
                {vuln.evidence?.screenshot ? (
                  <Box component="img" src={vuln.evidence.screenshot.startsWith('data:') ? vuln.evidence.screenshot : `data:image/png;base64,${vuln.evidence.screenshot}`} sx={{ width: '100%', borderRadius: '12px', border: '2px solid #2D2F39' }} />
                ) : <Box sx={{ p: 6, bgcolor: '#0D1014', textAlign: 'center', borderRadius: '12px', color: '#404F57', border: '1px dashed #2D2F39' }}>No evidence image provided</Box>}
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#8FFF9C", mb: 2, fontWeight: 900 }}>REPRODUCTION CURL</Typography>
              <pre className="bg-[#0D1014] p-5 rounded-xl border border-[#2D2F39] overflow-x-auto text-[#FFCC00] text-[13px] font-mono leading-relaxed">
                {vuln.reproduce_info?.curl_command || "# No reproduction command"}
              </pre>
            </Box>
          </Stack>
        )}

        {activeTab === 1 && (
          <Box className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Typography variant="subtitle2" sx={{ color: "#8FFF9C", mb: 2, fontWeight: 900 }}>FIX RECOMMENDATION</Typography>
            <Box sx={{ bgcolor: "#1E2429", p: 3, borderRadius: "12px", borderLeft: "4px solid #8FFF9C" }}>
              <Typography sx={{ color: "#FBFBFB", whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {vuln.recommendation || "No recommendation available."}
              </Typography>
            </Box>
          </Box>
        )}

        {activeTab === 2 && (
          <Stack spacing={4} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#8FFF9C", mb: 1.5, fontWeight: 900 }}>VULNERABILITY DESCRIPTION</Typography>
              <Typography sx={{ color: "#9AA6A8", lineHeight: 1.7 }}>{vuln.description || "N/A"}</Typography>
            </Box>
            <Divider sx={{ borderColor: "#2D2F39" }} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#8FFF9C", mb: 3, fontWeight: 900 }}>VULNERABILITY PARAMETERS</Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                <Box sx={{ flex: 1 }}><Typography variant="caption" sx={{ color: "#404F57", fontWeight: 800 }}>VULN TYPE</Typography><Typography sx={{ color: "#FBFBFB", fontWeight: 700 }}>{vuln.vuln_type || "N/A"}</Typography></Box>
                <Box sx={{ flex: 1 }}><Typography variant="caption" sx={{ color: "#404F57", fontWeight: 800 }}>METHOD</Typography><Typography sx={{ color: "#FBFBFB", fontWeight: 700 }}>{vuln.reproduce_info?.method || "GET"}</Typography></Box>
                <Box sx={{ flex: 2 }}><Typography variant="caption" sx={{ color: "#404F57", fontWeight: 800 }}>PARAM / DATA</Typography><Typography sx={{ color: "#FBFBFB", fontWeight: 700, wordBreak: 'break-all' }}>{vuln.parameters || "N/A"}</Typography></Box>
              </Stack>
            </Box>
          </Stack>
        )}

        {activeTab === 3 && (
          <Box className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Typography variant="subtitle2" sx={{ color: "#8FFF9C", mb: 4, fontWeight: 900 }}>DETECTION TIMELINE ({vuln.occurrence_count} Occurrences)</Typography>
            <Stack spacing={0} sx={{ position: 'relative', ml: 1 }}>
              <Box sx={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: '2px', bgcolor: '#2D2F39' }} />
              <Box sx={{ position: 'relative', pl: 5, mb: 4 }}>
                <Box sx={{ position: 'absolute', left: 0, top: 8, width: 16, height: 16, borderRadius: '50%', bgcolor: '#8FFF9C', border: `4px solid #111518`, zIndex: 1 }} />
                <Box sx={{ p: 2, bgcolor: 'rgba(143, 255, 156, 0.05)', borderRadius: '12px', border: '1px solid rgba(143, 255, 156, 0.2)' }}>
                  <Typography sx={{ color: "#8FFF9C", fontSize: '11px', fontWeight: 900 }}>LAST DETECTED</Typography>
                  <Typography sx={{ color: "#FBFBFB", fontSize: '14px', fontWeight: 700 }}>{new Date(vuln.dates.last_seen).toLocaleString('en-GB')}</Typography>
                </Box>
              </Box>
              {vuln.occurrence_date.slice(1).map((date, i) => (
                <Box key={i} sx={{ position: 'relative', pl: 5, mb: 2.5 }}>
                  <Box sx={{ position: 'absolute', left: 0, top: 8, width: 16, height: 16, borderRadius: '50%', bgcolor: '#404F57', border: `4px solid #111518`, zIndex: 1 }} />
                  <Box sx={{ p: 2, bgcolor: '#1E2429', borderRadius: '12px', border: '1px solid #2D2F39' }}>
                    {/* ลำดับครั้งจะลบ i+1 เพราะเราข้ามตัวแรกไป */}
                    <Typography sx={{ color: "#9AA6A8", fontSize: '11px', fontWeight: 900 }}>
                      DETECTION #{vuln.occurrence_count - (i + 1)}
                    </Typography>
                    <Typography sx={{ color: "#FBFBFB", fontSize: '14px', fontWeight: 700 }}>
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