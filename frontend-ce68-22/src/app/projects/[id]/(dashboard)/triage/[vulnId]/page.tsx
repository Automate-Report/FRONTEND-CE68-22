"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { 
  Box, Typography, Stack, Chip, Button, Divider, 
  Select, MenuItem, CircularProgress, Tabs, Tab 
} from "@mui/material";
import { 
  BugReport as BugIcon, 
  Schedule as TimeIcon, 
  AssignmentInd as AssignIcon,
  VerifiedUser as VerifyIcon,
  Description as InfoIcon,
  Build as FixIcon,
  History as LogIcon,
  Visibility as EvidenceIcon,
  Terminal as TerminalIcon,
  Storage as AssetIcon,
  Photo as ImageIcon,
  CheckCircle as TPIcon,
  Cancel as FPIcon,
  HelpOutline as PendingIcon
} from "@mui/icons-material";

import { useVuln } from "@/src/hooks/vuln/use-vuln";

export default function VulnDetailPage() {
  const params = useParams();
  const vulnId = parseInt(params.vulnId as string);
  const [activeTab, setActiveTab] = useState(0);

  const { data: vuln, isLoading, isError } = useVuln(vulnId);

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: "#8FFF9C" }} /></Box>;
  if (isError || !vuln) return <Box sx={{ p: 10, textAlign: 'center' }}><Typography color="error">Not Found</Typography></Box>;

  // --- Helper: Dynamic Styles ---
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'fixed') return { bg: "#8FFF9C", text: "#0D1014" };
    if (s === 'in_progress') return { bg: "#007AFF", text: "#FFFFFF" };
    if (s === 'open') return { bg: "#FE3B46", text: "#FFFFFF" };
    return { bg: "#404F57", text: "#FFFFFF" };
  };

  const statusStyle = getStatusColor(vuln.status);

  return (
    <Box className="bg-[#161B1F] rounded-2xl border border-[#404F57] overflow-hidden flex flex-col h-full animate-in fade-in duration-500">
      
      {/* ส่วนที่ 1: Header & Owner Management */}
      <Box p={4} bgcolor="#1E2429" borderBottom="1px solid #404F57">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Stack direction="row" spacing={1} mb={1.5} alignItems="center">
              <Chip 
                label={vuln.severity.toUpperCase()} 
                size="small" 
                sx={{ bgcolor: `${vuln.severity === 'critical' ? '#FE3B46' : '#FF9500'}20`, color: vuln.severity === 'critical' ? '#FE3B46' : '#FF9500', fontWeight: 900 }} 
              />
              <Chip 
                label={vuln.asset_name} 
                size="small"
                sx={{ bgcolor: "rgba(143, 255, 156, 0.05)", color: "#8FFF9C", fontWeight: 700 }} 
              />
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#FBFBFB", mb: 1 }}>{vuln.title}</Typography>
            
            {/* ส่วนแสดงผล TP / FP / Pending */}
            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                {vuln.verify === "tp" ? (
                    <Chip icon={<TPIcon sx={{ fontSize: '14px !important' }} />} label="TRUE POSITIVE" size="small" sx={{ bgcolor: 'rgba(143, 255, 156, 0.1)', color: '#8FFF9C', fontWeight: 800, border: '1px solid #8FFF9C30' }} />
                ) : vuln.status === 'fp' ? (
                    <Chip icon={<FPIcon sx={{ fontSize: '14px !important' }} />} label="FALSE POSITIVE" size="small" sx={{ bgcolor: 'rgba(254, 59, 70, 0.1)', color: '#FE3B46', fontWeight: 800, border: '1px solid #FE3B4630' }} />
                ) : (
                    <Chip icon={<PendingIcon sx={{ fontSize: '14px !important' }} />} label="WAITING FOR VERIFICATION" size="small" sx={{ bgcolor: 'rgba(154, 166, 168, 0.1)', color: '#9AA6A8', fontWeight: 800, border: '1px solid #404F57' }} />
                )}
            </Stack>
          </Box>

          {/* ปุ่ม Status ที่เปลี่ยนสีตามสถานะจริง */}
          <Button 
            variant="contained" 
            sx={{ 
                bgcolor: statusStyle.bg, 
                color: statusStyle.text, 
                fontWeight: 900, 
                borderRadius: '10px', 
                px: 3, 
                boxShadow: `0 4px 14px ${statusStyle.bg}40`,
                "&:hover": { bgcolor: statusStyle.bg, opacity: 0.9 } 
            }}
          >
            {vuln.status.replace('_', ' ').toUpperCase()}
          </Button>
        </Stack>

        <Divider sx={{ borderColor: "#404F57", mb: 3, opacity: 0.3 }} />

        {/* Management Controls */}
        <Stack direction="row" spacing={3}>
          <Box flex={1}>
            <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 900, display: 'block', mb: 1, letterSpacing: 1 }}>ASSIGNED TO</Typography>
            <Select fullWidth size="small" value={vuln.assigned_to || ""} sx={{ bgcolor: "#0D1014", color: "#E6F0E6", borderRadius: '10px', ".MuiOutlinedInput-notchedOutline": { borderColor: "#404F57" } }}>
              <MenuItem value={vuln.assigned_to || ""}>{vuln.assigned_to || "Select Developer"}</MenuItem>
            </Select>
          </Box>
          <Box flex={1}>
            <Typography variant="caption" sx={{ color: "#404F57", fontWeight: 900, display: 'block', mb: 1, letterSpacing: 1 }}>VERIFIED BY</Typography>
            <Select fullWidth size="small" value={vuln.verified_by || ""} sx={{ bgcolor: "#0D1014", color: "#E6F0E6", borderRadius: '10px', ".MuiOutlinedInput-notchedOutline": { borderColor: "#404F57" } }}>
              <MenuItem value={vuln.verified_by || ""}>{vuln.verified_by || "Select Auditor"}</MenuItem>
            </Select>
          </Box>
        </Stack>
      </Box>

      {/* ส่วนที่ 2: Content Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: '#404F57', bgcolor: '#161B1F' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ px: 2, '& .MuiTab-root': { color: '#404F57', fontWeight: 800, minHeight: '64px' }, '& .Mui-selected': { color: '#8FFF9C !important' }, '& .MuiTabs-indicator': { bgcolor: '#8FFF9C' } }}>
          <Tab icon={<EvidenceIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Evidence" />
          <Tab icon={<FixIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Remediation" />
          <Tab icon={<InfoIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Details" />
          <Tab icon={<LogIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Occurrence" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box p={4} sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: "#111518" }}>
        {activeTab === 0 && (
          <Stack spacing={4}>
            <Box>
                <Typography variant="subtitle2" sx={{ color: "#8FFF9C", mb: 2, fontWeight: 900 }}>SCREENSHOT EVIDENCE</Typography>
                {vuln.evidence?.screenshot ? (
                    <Box 
                      component="img" 
                      src={vuln.evidence.screenshot.startsWith('data:') ? vuln.evidence.screenshot : `data:image/png;base64,${vuln.evidence.screenshot}`} 
                      sx={{ width: '100%', borderRadius: '12px', border: '1px solid #404F57' }} 
                    />
                ) : <Box sx={{ p: 4, bgcolor: '#0D1014', textAlign: 'center', borderRadius: '12px', color: '#404F57' }}>No image available</Box>}
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#8FFF9C", mb: 2, fontWeight: 900 }}>REPRODUCE INFO</Typography>
              <pre className="bg-[#0D1014] p-5 rounded-xl border border-[#404F57] overflow-x-auto text-[#FFCC00] text-xs font-mono">
                {vuln.reproduce_info.curl_command}
              </pre>
            </Box>
          </Stack>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#8FFF9C", mb: 3, fontWeight: 900 }}>VULNERABILITY LIFECYCLE</Typography>
            <Stack spacing={3} sx={{ position: 'relative', ml: 1 }}>
              <Box sx={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: '2px', bgcolor: '#404F57', opacity: 0.3 }} />

              {/* Fixed Status */}
              {vuln.status === 'fixed' && (
                <Box sx={{ position: 'relative', pl: 5 }}>
                  <Box sx={{ position: 'absolute', left: 0, top: 8, width: 16, height: 16, borderRadius: '50%', bgcolor: '#8FFF9C', border: `4px solid #111518`, zIndex: 1 }} />
                  <Box sx={{ p: 2.5, bgcolor: 'rgba(143, 255, 156, 0.05)', borderRadius: '14px', border: '1px solid rgba(143, 255, 156, 0.2)' }}>
                    <Typography sx={{ color: "#8FFF9C", fontSize: '12px', fontWeight: 900, mb: 0.5 }}>แก้ไขเสร็จสิ้น</Typography>
                    <Typography sx={{ color: "#FBFBFB", fontSize: '14px', fontWeight: 700 }}>
                      {new Date(vuln.dates.last_seen).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {" เวลา "}
                      {new Date(vuln.dates.last_seen).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Occurrences */}
              {vuln.occurrance_date.map((date, i) => (
                <Box key={i} sx={{ position: 'relative', pl: 5 }}>
                  <Box sx={{ position: 'absolute', left: 0, top: 8, width: 16, height: 16, borderRadius: '50%', bgcolor: i === vuln.occurrance_date.length - 1 ? '#007AFF' : '#404F57', border: `4px solid #111518`, zIndex: 1 }} />
                  <Box sx={{ p: 2.5, bgcolor: '#1E2429', borderRadius: '14px', border: '1px solid #404F57' }}>
                    <Typography sx={{ color: i === vuln.occurrance_date.length - 1 ? "#007AFF" : "#9AA6A8", fontSize: '12px', fontWeight: 900, mb: 0.5 }}>
                      {i === vuln.occurrance_date.length - 1 ? "พบครั้งแรก" : `การตรวจพบครั้งที่ ${vuln.occurrance_count - i}`}
                    </Typography>
                    <Typography sx={{ color: "#FBFBFB", fontSize: '14px', fontWeight: 700 }}>
                      {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {" เวลา "}
                      {new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </Typography>
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