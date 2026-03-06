"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Box, Typography, Stack, Button, IconButton, 
  Chip, Tooltip, TextField, MenuItem, Select, 
  FormControl, InputLabel, Dialog, DialogTitle, 
  DialogContent, DialogActions, CircularProgress 
} from "@mui/material";
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  GetApp as DownloadIcon, 
  Delete as DeleteIcon, 
  CheckCircle as FinalizeIcon,
  Description as ReportIcon
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

// Hooks & Services
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { useProject } from "@/src/hooks/project/use-project";
import { getMe } from "@/src/services/auth.service";
import { penTestReportService } from "@/src/services/penTestReport.service";

// ข้อมูลตัวอย่าง (จะถูกแทนที่ด้วยข้อมูลจาก API ในภายหลัง)
const INITIAL_REPORTS = [
  { id: 101, name: "Pentest_WebApp_Q1", status: "draft", asset: "All Assets", date: "2026-03-01", created_by: "pentester@ai.com", startDate: "2026-02-01", endDate: "2026-03-01" },
  { id: 102, name: "API_Security_Audit", status: "final", asset: "Mobile API", date: "2026-02-15", created_by: "owner@ai.com", startDate: "2026-02-01", endDate: "2026-02-15" },
];

const ASSET_OPTIONS = ["All Assets", "Internal Web", "Mobile API", "Cloud Infra"];

export default function ReportCenterPage() {
  const router = useRouter();
  const { id: projectIdStr } = useParams();
  const projectId = parseInt(projectIdStr as string);

  // --- States ---
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newReport, setNewReport] = useState({ 
    name: "", 
    asset: "All Assets",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // --- Data Fetching ---
  const { data: project, isLoading: isProjectLoading } = useProject(projectId);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setCurrentUser(res.user);
      } catch (error) { console.error(error); }
    };
    fetchUser();
  }, []);

  // --- Permissions Logic ---
  const isOwner = project?.role?.toLowerCase() === "owner";
  
  const filteredReports = useMemo(() => {
    if (!currentUser) return [];
    if (isOwner) return reports;
    return reports.filter(r => r.created_by === currentUser.email || r.created_by === currentUser.username);
  }, [reports, currentUser, isOwner]);

  // --- Handlers ---
  const handleCreateReport = async () => {
    if (!newReport.name) return;
    
    setIsGenerating(true);
    try {
      const payload = {
        report_name: newReport.name,
        asset_ids: newReport.asset === "All Assets" 
          ? []
          : [Number(newReport.asset)]
      };

      // เรียกใช้ API ตามที่คุณส่งมา
      const response = await penTestReportService.create(projectId, payload);
      
      // อัปเดต UI (ในโปรเจกต์จริงควรใช้ refetch จาก useQuery)
      const reportData = {
        id: response.id || Date.now(),
        name: response.name || newReport.name,
        status: "draft",
        asset: newReport.asset,
        date: new Date().toISOString().split('T')[0],
        created_by: currentUser?.email || "me",
        startDate: newReport.startDate,
        endDate: newReport.endDate
      };
      
      setReports([reportData, ...reports]);
      setOpenCreate(false);
      setNewReport({ ...newReport, name: "" });
      toast.success("Report generation started");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalize = (id: number) => {
    // Logic สำหรับการเปลี่ยนสถานะจาก Draft เป็น Final (Lock ข้อมูล) [cite: 85, 89]
    setReports(reports.map(r => r.id === id ? { ...r, status: 'final' } : r));
    toast.success("Report finalized and locked");
  };

  if (isProjectLoading) return <Box sx={{ p: 4 }}><CircularProgress sx={{ color: "#8FFF9C" }} /></Box>;

  return (
    <Box sx={{ p: 4, pb: 10 }}>
      {/* Breadcrumbs */}
      <GenericBreadcrums 
        items={[
          { label: "Home", href: "/main" },
          { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
          { label: "Report Center", href: undefined }
        ]} 
      />

      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" my={4}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#FBFBFB" sx={{ letterSpacing: '-0.02em' }}>
            Report Center
          </Typography>
          <Typography variant="body2" sx={{ color: "#9AA6A8", mt: 0.5 }}>
            Generate and manage your Penetration Testing Reports 
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ bgcolor: "#8FFF9C", color: "#0D1014", fontWeight: 800, borderRadius: '8px', px: 3, "&:hover": { bgcolor: "#AFFFB9" } }}
          onClick={() => setOpenCreate(true)}
        >
          Generate Report
        </Button>
      </Stack>

      {/* Reports List */}
      <Stack spacing={2}>
        {filteredReports.map((report) => (
          <Box 
            key={report.id}
            sx={{ 
              bgcolor: "#1E2429", p: 3, borderRadius: "16px", border: "1px solid #2D2F39",
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: '0.2s', "&:hover": { borderColor: "#8FFF9C" }
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Box sx={{ position: 'relative' }}>
                <ReportIcon sx={{ fontSize: 40, color: report.status === 'final' ? '#8FFF9C' : '#FFCC00' }} />
                <Chip 
                  label={report.status.toUpperCase()} 
                  size="small" 
                  sx={{ 
                    position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
                    height: 16, fontSize: '8px', fontWeight: 900, bgcolor: report.status === 'final' ? '#8FFF9C' : '#FFCC00', color: '#0D1014'
                  }} 
                />
              </Box>
              <Box>
                <Typography variant="h6" color="#FBFBFB" fontWeight={700}>{report.name}</Typography>
                <Stack direction="row" spacing={2} mt={0.5} alignItems="center">
                   <Typography variant="caption" color="#9AA6A8">Asset Scope: <b>{report.asset}</b> [cite: 37]</Typography>
                   <Box sx={{ width: 4, height: 4, bgcolor: "#404F57", borderRadius: '50%' }} />
                   <Typography variant="caption" color="#404F57">
                     Period: {report.startDate} - {report.endDate} 
                   </Typography>
                </Stack>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              {report.status === 'draft' ? (
                <>
                  <Tooltip title="Edit Report Content">
                    <IconButton 
                      onClick={() => router.push(`/projects/${projectId}/reports/${report.id}/edit`)} 
                      sx={{ color: "#8FFF9C", bgcolor: "rgba(143, 255, 156, 0.05)" }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Finalize (Lock for Official Use) [cite: 89]">
                    <IconButton 
                      onClick={() => handleFinalize(report.id)} 
                      sx={{ color: "#8FFF9C", bgcolor: "rgba(143, 255, 156, 0.05)" }}
                    >
                      <FinalizeIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Tooltip title="Download Final PDF">
                  <IconButton sx={{ color: "#FBFBFB", bgcolor: "rgba(251, 251, 251, 0.05)" }}><DownloadIcon fontSize="small" /></IconButton>
                </Tooltip>
              )}
              <IconButton 
                onClick={() => setDeleteTarget(report)} 
                sx={{ color: "#FE3B46", opacity: 0.6, "&:hover": { opacity: 1 } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        ))}

        {filteredReports.length === 0 && (
          <Box sx={{ py: 10, textAlign: 'center', border: '1px dashed #2D2F39', borderRadius: '16px' }}>
            <Typography color="#404F57">No reports found.</Typography>
          </Box>
        )}
      </Stack>

      {/* --- Dialog: Create Report --- */}
      <Dialog 
        open={openCreate} 
        onClose={() => !isGenerating && setOpenCreate(false)}
        PaperProps={{ sx: { bgcolor: '#1E2429', color: '#FBFBFB', borderRadius: '16px', border: '1px solid #2D2F39', minWidth: '450px' } }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Generate Pentest Report </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField 
              fullWidth label="Report Name" 
              value={newReport.name}
              onChange={(e) => setNewReport({...newReport, name: e.target.value})}
              placeholder="e.g. Internal_Security_Audit_Q1"
              disabled={isGenerating}
              InputLabelProps={{ sx: { color: '#404F57' } }}
              sx={{ "& .MuiOutlinedInput-root": { color: '#FBFBFB', "& fieldset": { borderColor: '#2D2F39' } } }}
            />
            <FormControl fullWidth disabled={isGenerating}>
              <InputLabel sx={{ color: '#404F57' }}>Select Asset Scope [cite: 37]</InputLabel>
              <Select
                value={newReport.asset}
                label="Select Asset Scope"
                onChange={(e) => setNewReport({...newReport, asset: e.target.value})}
                sx={{ bgcolor: '#0D1014', color: '#FBFBFB', borderRadius: '8px', ".MuiOutlinedInput-notchedOutline": { borderColor: "#2D2F39" } }}
              >
                {ASSET_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={2}>
              <TextField 
                type="date" label="Testing Start " fullWidth 
                value={newReport.startDate}
                disabled={isGenerating}
                onChange={(e) => setNewReport({...newReport, startDate: e.target.value})}
                InputLabelProps={{ shrink: true, sx: { color: '#404F57' } }}
                sx={{ "& .MuiOutlinedInput-root": { color: '#FBFBFB', "& fieldset": { borderColor: '#2D2F39' } } }}
              />
              <TextField 
                type="date" label="Testing End " fullWidth 
                value={newReport.endDate}
                disabled={isGenerating}
                onChange={(e) => setNewReport({...newReport, endDate: e.target.value})}
                InputLabelProps={{ shrink: true, sx: { color: '#404F57' } }}
                sx={{ "& .MuiOutlinedInput-root": { color: '#FBFBFB', "& fieldset": { borderColor: '#2D2F39' } } }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenCreate(false)} sx={{ color: '#FBFBFB' }} disabled={isGenerating}>Cancel</Button>
          <Button 
            variant="contained" 
            disabled={!newReport.name || isGenerating}
            onClick={handleCreateReport}
            sx={{ bgcolor: "#8FFF9C", color: "#0D1014", fontWeight: 800 }}
          >
            {isGenerating ? <CircularProgress size={24} color="inherit" /> : "Generate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <GenericDeleteModal 
          open={!!deleteTarget}
          entityName={deleteTarget.name}
          entityType="Report"
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            setReports(reports.filter(r => r.id !== deleteTarget.id));
            setDeleteTarget(null);
            toast.success("Report deleted");
          }}
        />
      )}
    </Box>
  );
}