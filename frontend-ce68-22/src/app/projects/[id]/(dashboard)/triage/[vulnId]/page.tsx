"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Box, Typography, Stack, Chip, Divider, 
  Select, MenuItem, CircularProgress, Tabs, Tab, FormControl 
} from "@mui/material";
import { 
  Description as InfoIcon,
  Build as FixIcon,
  History as LogIcon,
  Visibility as EvidenceIcon,
  CheckCircle as TPIcon,
  Cancel as FPIcon,
  HelpOutline as PendingIcon
} from "@mui/icons-material";

// Hooks
import { useVuln } from "@/src/hooks/vuln/use-vuln";
import { useMembers } from "@/src/hooks/project/use-members";
import { useAssignVuln } from "@/src/hooks/vuln/use-assignVuln";

export default function VulnDetailPage() {
  const params = useParams();
  const vulnId = parseInt(params.vulnId as string);
  const projectId = parseInt(params.id as string);
  const [activeTab, setActiveTab] = useState(0);
  const queryClient = useQueryClient();

  const { data: vuln, isLoading: isVulnLoading, isError } = useVuln(vulnId);
  const { data: membersData, isLoading: isMembersLoading } = useMembers(
    projectId, 1, 100, "firstname", "asc", "", "ALL"
  );
  
  const { mutate: assignVuln, isPending: isAssigning } = useAssignVuln(vulnId);

  const members = membersData?.items || [];

  const handleAssignChange = (position: "assigned_to" | "verified_by", userId: string) => {
    assignVuln({ position, user_id: userId }, {
      onSuccess: () => {
        // ต้องมั่นใจว่า Key ตรงกับ useVuln (ในไฟล์ของคุณใช้ ["vulns", vulnId])
        queryClient.invalidateQueries({ queryKey: ["vulns", vulnId] });
      }
    });
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'fixed') return { bg: "#8FFF9C", text: "#0D1014" };
    if (s === 'in_progress') return { bg: "#007AFF", text: "#FFFFFF" };
    if (s === 'open') return { bg: "#FE3B46", text: "#FFFFFF" };
    if (s === 'fp') return { bg: "#404F57", text: "#FFFFFF" };
    return { bg: "#1E2429", text: "#9AA6A8" };
  };

  if (isVulnLoading || isMembersLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
      <CircularProgress sx={{ color: "#8FFF9C" }} />
    </Box>
  );

  if (isError || !vuln) return (
    <Box sx={{ p: 10, textAlign: 'center' }}><Typography color="error" sx={{ fontWeight: 800 }}>Vulnerability Entity Not Found</Typography></Box>
  );

  const statusStyle = getStatusColor(vuln.status);

  return (
    <Box className="bg-[#161B1F] rounded-2xl border border-[#2D2F39] overflow-hidden flex flex-col h-full animate-in fade-in duration-500 shadow-2xl">
      
      {/* ส่วนที่ 1: Header */}
      <Box p={4} bgcolor="#1E2429" borderBottom="1px solid #2D2F39">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Stack direction="row" spacing={1} mb={1.5} alignItems="center">
              <Chip label={vuln.severity.toUpperCase()} size="small" sx={{ bgcolor: `${vuln.severity === 'critical' ? '#FE3B46' : '#FF9500'}20`, color: vuln.severity === 'critical' ? '#FE3B46' : '#FF9500', fontWeight: 900, fontSize: '10px' }} />
              <Chip label={vuln.asset_name} size="small" sx={{ bgcolor: "#272D31", color: "#8FFF9C", fontWeight: 700, fontSize: '10px', border: '1px solid #404F57' }} />
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#FBFBFB", mb: 1, letterSpacing: '-0.02em' }}>{vuln.title}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
                {vuln.verify === "tp" ? (
                  <Chip icon={<TPIcon sx={{ fontSize: '14px !important' }} />} label="TRUE POSITIVE" size="small" sx={{ bgcolor: 'rgba(143, 255, 156, 0.05)', color: '#8FFF9C', fontWeight: 800 }} />
                ) : (
                  <Chip icon={<PendingIcon sx={{ fontSize: '14px !important' }} />} label="WAITING FOR VERIFICATION" size="small" sx={{ bgcolor: '#272D31', color: '#9AA6A8', fontWeight: 800 }} />
                )}
            </Stack>
          </Box>

          <FormControl size="small">
            <Select value={vuln.status} sx={{ minWidth: 160, bgcolor: statusStyle.bg, color: statusStyle.text, fontWeight: 900, borderRadius: '8px', ".MuiOutlinedInput-notchedOutline": { border: "none" }, height: 40, fontSize: '13px' }}>
                <MenuItem value="open">OPEN</MenuItem>
                <MenuItem value="in_progress">IN PROGRESS</MenuItem>
                <MenuItem value="fixed">FIXED</MenuItem>
                <MenuItem value="fp">FALSE POSITIVE</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Divider sx={{ borderColor: "#2D2F39", mb: 3, opacity: 0.5 }} />

        <Stack direction="row" spacing={3}>
          <Box flex={1}>
            <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 900, display: 'block', mb: 1, letterSpacing: 1.5 }}>ASSIGNED TO (DEV/OWNER)</Typography>
            <Select 
                fullWidth size="small" value={vuln.assigned_to || ""} displayEmpty disabled={isAssigning}
                onChange={(e) => handleAssignChange("assigned_to", e.target.value)}
                sx={{ bgcolor: "#0D1014", color: "#E6F0E6", borderRadius: '8px', ".MuiOutlinedInput-notchedOutline": { borderColor: "#2D2F39" } }}
            >
              <MenuItem value=""><em>Unassigned</em></MenuItem>
              {members.filter(m => m.role.toLowerCase() === 'developer' || m.role.toLowerCase() === 'owner').map((m) => (
                <MenuItem key={m.email} value={m.email}>{m.firstname} {m.lastname} ({m.role})</MenuItem>
              ))}
            </Select>
          </Box>

          <Box flex={1}>
            <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 900, display: 'block', mb: 1, letterSpacing: 1.5 }}>VERIFIED BY (PENTESTER/OWNER)</Typography>
            <Select 
                fullWidth size="small" value={vuln.verified_by || ""} displayEmpty disabled={isAssigning}
                onChange={(e) => handleAssignChange("verified_by", e.target.value)}
                sx={{ bgcolor: "#0D1014", color: "#E6F0E6", borderRadius: '8px', ".MuiOutlinedInput-notchedOutline": { borderColor: "#2D2F39" } }}
            >
              <MenuItem value=""><em>Not Verified</em></MenuItem>
              {members.filter(m => m.role.toLowerCase() === 'pentester' || m.role.toLowerCase() === 'owner').map((m) => (
                <MenuItem key={m.email} value={m.email}>{m.firstname} {m.lastname} ({m.role})</MenuItem>
              ))}
            </Select>
          </Box>
        </Stack>
      </Box>

      {/* ส่วนที่ 2: Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: '#2D2F39', bgcolor: '#161B1F' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ px: 2, '& .MuiTab-root': { color: '#404F57', fontWeight: 800, minHeight: '64px' }, '& .Mui-selected': { color: '#8FFF9C !important' }, '& .MuiTabs-indicator': { bgcolor: '#8FFF9C' } }}>
          <Tab icon={<EvidenceIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Evidence" />
          <Tab icon={<FixIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Remediation" />
          <Tab icon={<InfoIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Details" />
          <Tab icon={<LogIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Timeline" />
        </Tabs>
      </Box>

      {/* ส่วนที่ 3: Content Area */}
      <Box p={4} sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: "#111518" }}>
        
        {/* Tab 0: Evidence */}
        {activeTab === 0 && (
          <Stack spacing={4} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Box>
                <Typography variant="subtitle2" sx={{ color: "#8FFF9C", mb: 2, fontWeight: 900 }}>SCREENSHOT PROOF</Typography>
                {vuln.evidence?.screenshot ? (
                  <Box component="img" src={vuln.evidence.screenshot.startsWith('data:') ? vuln.evidence.screenshot : `data:image/png;base64,${vuln.evidence.screenshot}`} sx={{ width: '100%', borderRadius: '12px', border: '2px solid #2D2F39' }} />
                ) : (
                  <Box sx={{ p: 6, bgcolor: '#0D1014', textAlign: 'center', borderRadius: '12px', color: '#404F57', border: '1px dashed #2D2F39' }}>No evidence image provided</Box>
                )}
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#8FFF9C", mb: 2, fontWeight: 900 }}>REPRODUCTION CURL</Typography>
              <pre className="bg-[#0D1014] p-5 rounded-xl border border-[#2D2F39] overflow-x-auto text-[#FFCC00] text-[13px] font-mono leading-relaxed">
                {vuln.reproduce_info?.curl_command || "# No reproduction command available"}
              </pre>
            </Box>
          </Stack>
        )}

        {/* Tab 1: Remediation */}
        {activeTab === 1 && (
          <Box className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Typography variant="subtitle2" sx={{ color: "#8FFF9C", mb: 2, fontWeight: 900 }}>FIX RECOMMENDATION</Typography>
            <Box sx={{ bgcolor: "#1E2429", p: 3, borderRadius: "12px", borderLeft: "4px solid #8FFF9C" }}>
              <Typography sx={{ color: "#FBFBFB", whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {vuln.recommendation || "No recommendation available for this vulnerability."}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Tab 2: Details (No Grid, using Stack) */}
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
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 800, letterSpacing: 1 }}>VULN TYPE</Typography>
                  <Typography sx={{ color: "#FBFBFB", fontWeight: 700, mt: 0.5 }}>{vuln.vuln_type || "N/A"}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 800, letterSpacing: 1 }}>METHOD</Typography>
                  <Typography sx={{ color: "#FBFBFB", fontWeight: 700, mt: 0.5 }}>{vuln.reproduce_info?.method || "GET"}</Typography>
                </Box>
                <Box sx={{ flex: 2 }}>
                  <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 800, letterSpacing: 1 }}>PARAM / DATA</Typography>
                  <Typography sx={{ color: "#FBFBFB", fontWeight: 700, mt: 0.5, wordBreak: 'break-all' }}>
                    {vuln.parameters || "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        )}

        {/* Tab 3: Timeline */}
        {activeTab === 3 && (
          <Box className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Typography variant="subtitle2" sx={{ color: "#8FFF9C", mb: 4, fontWeight: 900 }}>DETECTION TIMELINE ({vuln.occurrance_count} Occurrences)</Typography>
            <Stack spacing={0} sx={{ position: 'relative', ml: 1 }}>
              <Box sx={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: '2px', bgcolor: '#2D2F39' }} />
              
              {/* Last Seen (First node in timeline) */}
              <Box sx={{ position: 'relative', pl: 5, mb: 4 }}>
                <Box sx={{ position: 'absolute', left: 0, top: 8, width: 16, height: 16, borderRadius: '50%', bgcolor: '#8FFF9C', border: `4px solid #111518`, zIndex: 1 }} />
                <Box sx={{ p: 2, bgcolor: 'rgba(143, 255, 156, 0.05)', borderRadius: '12px', border: '1px solid rgba(143, 255, 156, 0.2)' }}>
                  <Typography sx={{ color: "#8FFF9C", fontSize: '11px', fontWeight: 900 }}>LAST DETECTED</Typography>
                  <Typography sx={{ color: "#FBFBFB", fontSize: '14px', fontWeight: 700 }}>{new Date(vuln.dates.last_seen).toLocaleString('en-GB')}</Typography>
                </Box>
              </Box>

              {/* History list from occurrance_date */}
              {vuln.occurrance_date.map((date, i) => (
                <Box key={i} sx={{ position: 'relative', pl: 5, mb: 2.5 }}>
                  <Box sx={{ position: 'absolute', left: 0, top: 8, width: 16, height: 16, borderRadius: '50%', bgcolor: '#404F57', border: `4px solid #111518`, zIndex: 1 }} />
                  <Box sx={{ p: 2, bgcolor: '#1E2429', borderRadius: '12px', border: '1px solid #2D2F39' }}>
                    <Typography sx={{ color: "#9AA6A8", fontSize: '11px', fontWeight: 900 }}>DETECTION #{vuln.occurrance_count - i}</Typography>
                    <Typography sx={{ color: "#FBFBFB", fontSize: '14px', fontWeight: 700 }}>{new Date(date).toLocaleString('en-GB')}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}