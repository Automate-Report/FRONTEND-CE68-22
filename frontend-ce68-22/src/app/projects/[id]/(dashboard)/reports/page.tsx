"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Box, Typography, Stack, Button, IconButton, 
  Chip, TextField, MenuItem, Select, 
  FormControl, InputLabel, Dialog, DialogTitle, 
  DialogContent, DialogActions, CircularProgress,
  OutlinedInput
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

// Components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { GenericPagination } from "@/src/components/Common/GenericPagination";
import { ReportCard } from "@/src/components/reports/ReportCard";

// Hooks & Services
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

  // --- States ---
  const [page, setPage] = useState(0); 
  const [size, setSize] = useState(6);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [assetOptions, setAssetOptions] = useState<AssetNameAndId[]>([]);
  const [newReport, setNewReport] = useState({ name: "", assets: ["ALL"] as string[] });

  // --- Data Fetching ---
  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { data: reportsData, isLoading: isReportsLoading, refetch } = usePenTestReports(projectId, page + 1, size, "created_at", "desc", search, "ALL");

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

  const reports = useMemo(() => reportsData?.items || [], [reportsData]);

  const handleCreateReport = async () => {
    if (!newReport.name || newReport.assets.length === 0) return;
    setIsGenerating(true);
    try {
      const payload: CreateReportPayload = {
        report_name: newReport.name,
        asset_ids: newReport.assets.includes("ALL") ? undefined : newReport.assets.map(id => Number(id)) 
      };
      await penTestReportService.create(projectId, payload);
      setOpenCreate(false);
      setNewReport({ name: "", assets: ["ALL"] });
      toast.success("Report generation started");
      refetch(); 
    } catch (error: any) {
      toast.error(error.message || "Failed to generate report");
    } finally { setIsGenerating(false); }
  };

  if (isProjectLoading) return <Box sx={{ p: 4 }}><CircularProgress sx={{ color: "#34D399" }} /></Box>;

  return (
    <Box sx={{ p: 4, pb: 10 }}>
      <GenericBreadcrums 
        items={[
          { label: "Home", href: "/main" },
          { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
          { label: "Report Center", href: undefined }
        ]} 
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center" my={4} spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#FBFBFB">Report Center</Typography>
          <Typography variant="body2" sx={{ color: "#9AA6A8", mt: 0.5 }}>Manage Penetration Testing Reports [cite: 1]</Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <TextField 
            size="small" placeholder="Search reports..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            InputProps={{ startAdornment: <SearchIcon sx={{ color: "#404F57", mr: 1 }} /> }}
            sx={{ bgcolor: "#1E2429", borderRadius: "8px", "& fieldset": { border: "none" }, input: { color: "white" } }}
          />
          <Button 
            variant="contained" startIcon={<AddIcon />}
            sx={{ bgcolor: "#34D399", color: "#0D1014", fontWeight: 800, px: 3 }}
            onClick={() => setOpenCreate(true)}
          >
            Generate Report
          </Button>
        </Stack>
      </Stack>

      {/* List Section */}
      <Stack spacing={1.5} minHeight="450px">
        {isReportsLoading ? (
          <CircularProgress sx={{ color: "#34D399", alignSelf: "center", my: 10 }} />
        ) : (
          reports.map((report) => (
            <ReportCard 
              key={report.id}
              report={report}
              onEdit={(id) => router.push(`/projects/${projectId}/reports/${id}/edit`)}
              onDownload={() => toast.success("Downloading...")}
              onDelete={(r) => setDeleteTarget(r)}
            />
          ))
        )}
      </Stack>

      {reportsData && reportsData.total > 0 && (
        <GenericPagination
          count={reportsData.total}
          page={page}
          rowsPerPage={size}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newSize) => { setSize(newSize); setPage(0); }}
        />
      )}

      {/* --- Create Dialog (Multiple Assets Selection) --- */}
      <Dialog open={openCreate} onClose={() => !isGenerating && setOpenCreate(false)} PaperProps={{ sx: { bgcolor: '#1E2429', color: '#FBFBFB', borderRadius: '16px', minWidth: '450px' } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Generate Pentest Report</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField fullWidth label="Report Name" value={newReport.name} onChange={(e) => setNewReport({...newReport, name: e.target.value})} InputLabelProps={{ sx: { color: '#404F57' } }} sx={{ "& .MuiOutlinedInput-root": { color: '#FBFBFB' } }} />
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#404F57' }}>Select Asset Scope [cite: 37]</InputLabel>
              <Select
                multiple value={newReport.assets}
                onChange={(e) => setNewReport({...newReport, assets: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value})}
                input={<OutlinedInput label="Select Asset Scope" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((val) => (
                      <Chip key={val} label={val === "ALL" ? "All Assets" : assetOptions.find(a => a.id.toString() === val)?.name} sx={{ bgcolor: "#34D399", color: "#0D1014", fontWeight: 700, height: '24px' }} />
                    ))}
                  </Box>
                )}
                sx={{ bgcolor: '#0D1014', color: '#FBFBFB' }}
              >
                <MenuItem value="ALL">All Assets (Global)</MenuItem>
                {assetOptions.map(opt => <MenuItem key={opt.id} value={opt.id.toString()}>{opt.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenCreate(false)} sx={{ color: '#FBFBFB' }}>Cancel</Button>
          <Button variant="contained" disabled={!newReport.name || isGenerating} onClick={handleCreateReport} sx={{ bgcolor: "#34D399", color: "#0D1014", fontWeight: 800 }}>
            {isGenerating ? <CircularProgress size={24} color="inherit" /> : "Generate"}
          </Button>
        </DialogActions>
      </Dialog>

      {deleteTarget && (
        <GenericDeleteModal 
          open={!!deleteTarget} 
          entityName={deleteTarget.file_name}
          entityType="Report" 
          onClose={() => setDeleteTarget(null)} 
          onConfirm={async () => { 
            try {
              // ✅ เรียกใช้ Service สำหรับลบข้อมูลจาก Database/Storage
              await penTestReportService.delete(deleteTarget.id);
              
              toast.success("Report deleted successfully");
              setDeleteTarget(null);
              
              // ✅ รีเฟรชข้อมูลในรายการเพื่อให้ยอดรวมและลำดับถูกต้อง
              refetch(); 
            } catch (error: any) {
              toast.error(error.message || "Failed to delete report");
            }
          }} 
        />
      )}
    </Box>
  );
}