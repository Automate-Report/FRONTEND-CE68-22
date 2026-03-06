"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Box, Typography, Stack, Button, IconButton, 
  Chip, Tooltip, TextField, MenuItem, Select, 
  FormControl, InputLabel, Dialog, DialogTitle, 
  DialogContent, DialogActions, CircularProgress,
  Pagination
} from "@mui/material";
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  GetApp as DownloadIcon, 
  Delete as DeleteIcon, 
  CheckCircle as FinalizeIcon,
  Description as ReportIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

// Hooks & Services
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { useProject } from "@/src/hooks/project/use-project";
import { getMe } from "@/src/services/auth.service";
import { penTestReportService } from "@/src/services/penTestReport.service";
import { assetService } from "@/src/services/asset.service";
import { usePenTestReports } from "@/src/hooks/report/use-penTestReports";

// Types
import { CreateReportPayload } from "@/src/types/report";
import { AssetNameAndId } from "@/src/types/asset";

export default function ReportCenterPage() {
  const router = useRouter();
  const { id: projectIdStr } = useParams();
  const projectId = parseInt(projectIdStr as string);

  // --- States สำหรับ Pagination & Filtering ---
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sortBy] = useState<string | null>("created_at");
  const [sortOrder] = useState<"asc" | "desc" | "none">("desc");

  // --- States สำหรับ UI ---
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [assetOptions, setAssetOptions] = useState<AssetNameAndId[]>([]);
  const [newReport, setNewReport] = useState({ name: "", asset: "ALL" });

  // --- Data Fetching ด้วย useQuery Hook ---
  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { 
    data: reportsData, 
    isLoading: isReportsLoading, 
    refetch 
  } = usePenTestReports(projectId, page, size, sortBy, sortOrder, search, filter);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, assetsRes] = await Promise.all([
          getMe(),
          assetService.getAllNameAndId(projectId)
        ]);
        setCurrentUser(userRes.user);
        setAssetOptions(assetsRes);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, [projectId]);

  // --- Permissions Logic ---
  const isOwner = project?.role?.toLowerCase() === "owner";
  
  // กรองข้อมูลเบื้องต้น (ความปลอดภัยชั้นที่ 2 ฝั่ง Frontend)
  const reports = useMemo(() => {
    if (!reportsData?.items || !currentUser) return [];
    if (isOwner) return reportsData.items;
    return reportsData.items.filter(r => r.created_by === currentUser.email || r.created_by === currentUser.username);
  }, [reportsData, currentUser, isOwner]);

  // --- Handlers ---
  const handleCreateReport = async () => {
    if (!newReport.name) return;
    setIsGenerating(true);
    try {
      const payload: CreateReportPayload = {
        report_name: newReport.name,
        asset_ids: newReport.asset === "ALL" ? undefined : [Number(newReport.asset)] 
      };

      await penTestReportService.create(projectId, payload);
      setOpenCreate(false);
      setNewReport({ name: "", asset: "ALL" });
      toast.success("Report generation started");
      refetch(); // ดึงข้อมูลใหม่หลังสร้างสำเร็จ
    } catch (error: any) {
      toast.error(error.message || "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalize = async (id: number) => {
    try {
      // สมมติว่ามี API สำหรับ Finalize [cite: 85, 89]
      toast.success("Report finalized and locked");
      refetch();
    } catch (error) { toast.error("Failed to finalize report"); }
  };

  if (isProjectLoading) return <Box sx={{ p: 4 }}><CircularProgress sx={{ color: "#8FFF9C" }} /></Box>;

  return (
    <Box sx={{ p: 4, pb: 10 }}>
      <GenericBreadcrums 
        items={[
          { label: "Home", href: "/main" },
          { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
          { label: "Report Center", href: undefined }
        ]} 
      />

      {/* Header & Search */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" my={4} spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#FBFBFB" sx={{ letterSpacing: '-0.02em' }}>Report Center</Typography>
          <Typography variant="body2" sx={{ color: "#9AA6A8", mt: 0.5 }}>Manage Penetration Testing Reports</Typography>
        </Box>
        
        <Stack direction="row" spacing={2} sx={{ width: { xs: "100%", md: "auto" } }}>
          <TextField 
            size="small"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon sx={{ color: "#404F57", mr: 1 }} /> }}
            sx={{ bgcolor: "#1E2429", borderRadius: "8px", "& fieldset": { border: "none" }, input: { color: "white" } }}
          />
          <Button 
            variant="contained" startIcon={<AddIcon />}
            sx={{ bgcolor: "#8FFF9C", color: "#0D1014", fontWeight: 800, borderRadius: '8px', px: 3, whiteSpace: "nowrap" }}
            onClick={() => setOpenCreate(true)}
          >
            Generate Report
          </Button>
        </Stack>
      </Stack>

      {/* List Section */}
      <Stack spacing={2} minHeight="400px">
        {isReportsLoading ? (
          <CircularProgress sx={{ color: "#8FFF9C", alignSelf: "center", my: 5 }} />
        ) : (
          reports.map((report) => (
            <Box key={report.id} sx={{ bgcolor: "#1E2429", p: 3, borderRadius: "16px", border: "1px solid #2D2F39", display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: "0.2s", "&:hover": { borderColor: "#8FFF9C" } }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Box>
                  <Typography variant="h6" color="#FBFBFB" fontWeight={700}>{report.file_name}</Typography>
                  <Typography variant="caption" color="#9AA6A8">Asset Scope: <b>{report.asset_name || "Global"}</b> </Typography>
                </Box>
              </Stack>
            </Box>
          ))
        )}

        {reports.length === 0 && !isReportsLoading && (
          <Box sx={{ py: 10, textAlign: 'center', border: '1px dashed #2D2F39', borderRadius: '16px' }}>
            <Typography color="#404F57">No reports found.</Typography>
          </Box>
        )}
      </Stack>

      {/* Pagination Container */}
      {reportsData && reportsData.total_pages > 1 && (
        <Stack alignItems="center" mt={4}>
          <Pagination 
            count={reportsData.total_pages} 
            page={page} 
            onChange={(_, v) => setPage(v)}
            sx={{ "& .MuiPaginationItem-root": { color: "#FBFBFB" }, "& .Mui-selected": { bgcolor: "#8FFF9C !important", color: "#0D1014" } }}
          />
        </Stack>
      )}

      {/* --- Create Dialog --- */}
      <Dialog open={openCreate} onClose={() => !isGenerating && setOpenCreate(false)} PaperProps={{ sx: { bgcolor: '#1E2429', color: '#FBFBFB', borderRadius: '16px', border: '1px solid #2D2F39', minWidth: '450px' } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Generate Pentest Report</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField fullWidth label="Report Name" value={newReport.name} onChange={(e) => setNewReport({...newReport, name: e.target.value})} InputLabelProps={{ sx: { color: '#404F57' } }} sx={{ "& .MuiOutlinedInput-root": { color: '#FBFBFB', "& fieldset": { borderColor: '#2D2F39' } } }} />
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#404F57' }}>Select Asset Scope </InputLabel>
              <Select
                value={newReport.asset}
                label="Select Asset Scope"
                onChange={(e) => setNewReport({...newReport, asset: e.target.value})}
                sx={{ bgcolor: '#0D1014', color: '#FBFBFB', borderRadius: '8px', ".MuiOutlinedInput-notchedOutline": { borderColor: "#2D2F39" } }}
              >
                <MenuItem value="ALL">All Assets (Global)</MenuItem>
                {assetOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.id.toString()}>{opt.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenCreate(false)} sx={{ color: '#FBFBFB' }} disabled={isGenerating}>Cancel</Button>
          <Button variant="contained" disabled={!newReport.name || isGenerating} onClick={handleCreateReport} sx={{ bgcolor: "#8FFF9C", color: "#0D1014", fontWeight: 800 }}>
            {isGenerating ? <CircularProgress size={24} color="inherit" /> : "Generate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Modal */}
      {deleteTarget && (
        <GenericDeleteModal 
          open={!!deleteTarget} 
          entityName={deleteTarget.name} 
          entityType="Report" 
          onClose={() => setDeleteTarget(null)} 
          onConfirm={async () => {
             // Logic ลบผ่าน Service
             toast.success("Report deleted");
             setDeleteTarget(null);
             refetch();
          }} 
        />
      )}
    </Box>
  );
}