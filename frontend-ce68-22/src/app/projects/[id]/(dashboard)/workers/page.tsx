"use client";

import { use, useState, useEffect } from "react";
import { useProject } from "@/src/hooks/project/use-project";
import { useWorkerPage } from "@/src/hooks/worker/use-workerPage";
import { useWorkers } from "@/src/hooks/worker/use-workers";
import { useWorkerInfoSummary } from "@/src/hooks/worker/use-workerInfoSummary";
import { useTable } from "@/src/hooks/use-table";
import { useDebounce } from "@/src/hooks/use-debounce";
import { useWorkerDownload } from "@/src/hooks/worker/use-WorkerDownload";
import { toast } from "react-hot-toast";

import { workerService } from "@/src/services/worker.service";

import { Worker as WorkerType } from "@/src/types/worker";

import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { GenericPagination } from "@/src/components/Common/GenericPagination";
import { WorkerUnlinkModal } from "@/src/components/workers/WorkerUnLinkModal";
import { WorkerCard } from "@/src/components/workers/WorkerCard";
import CreateWorkerIcon from "@/src/components/icon/CreateWorker";

import { Box, Typography, InputBase, Button, Stack, MenuItem, Menu, CircularProgress } from "@mui/material";
import { 
  Engineering as TotalIcon, 
  Dns as OnlineIcon, 
  Speed as BusyIcon, 
  AssignmentTurnedIn as JobIcon,
  Search as SearchIcon, 
  FilterList as FilterIcon, 
  LinkOff as UnlinkIcon 
} from "@mui/icons-material";

import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WorkersPage({ params }: PageProps) {
  const resolvePrams = use(params);
  const projectId = parseInt(resolvePrams.id);

  // --- Search & Filter States ---
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // --- Unlink State ---
  const [unlinkModal, setUnlinkModal] = useState<{ open: boolean; target: WorkerType | null; isAll: boolean; loading: boolean }>({
    open: false,
    target: null,
    isAll: false,
    loading: false,
  });

  // --- Download ---
  const { downloadWorker, isLoading: isDownloading } = useWorkerDownload();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const {
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTable();

  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { data: response, isLoading, refetch } = useWorkers(
    projectId,
    page + 1, 
    rowsPerPage, 
    sortBy, 
    sortOrder,
    debouncedSearch,
    statusFilter
  );

  const { data: workerInfo = { total: 0, online: 0, busy: 0, total_jobs: 0 } } = useWorkerInfoSummary(projectId);
  const { deleteState } = useWorkerPage(refetch);

  useEffect(() => {
    handleChangePage(null, 0);
  }, [debouncedSearch, statusFilter, handleChangePage]);

  // --- Handlers ---
  const handleUnlinkClick = (worker: WorkerType) => {
    setUnlinkModal({ open: true, target: worker, isAll: false, loading: false });
  };

  const handleUnlinkAllClick = () => {
    setUnlinkModal({ open: true, target: null, isAll: true, loading: false });
  };

  const handleConfirmUnlink = async () => {
    setUnlinkModal(prev => ({ ...prev, loading: true }));
    try {
      if (unlinkModal.isAll) {
        await workerService.unLinkAll(projectId);
      } else if (unlinkModal.target) {
        await workerService.unLink(unlinkModal.target.id);
      }
      setUnlinkModal({ open: false, target: null, isAll: false, loading: false });
      refetch();
    } catch (error) {
      alert("Action failed");
    } finally {
      setUnlinkModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDownload = async (e: React.MouseEvent, workerId: number, workerName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDownloadingId(workerId); // เริ่มต้นดาวน์โหลด: เก็บ ID ไว้แสดง Spinner
    try {
      toast.loading("Preparing your configuration...", { id: "dl-toast" });
      await downloadWorker(workerId, workerName);
      toast.success("Download started!", { id: "dl-toast" });
      refetch(); // รีเฟรชข้อมูลหลังดาวน์โหลด เผื่อสถานะเปลี่ยน
    } catch (err) {
      toast.error("Download failed", { id: "dl-toast" });
    } finally {
      setDownloadingId(null); // ดาวน์โหลดเสร็จ (หรือพัง): เอา Spinner ออก
    }
  };

  const isOwner = project?.role === "owner";
  const workers = response?.items || [];
  const totalCnt = response?.total || 0;

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project?.name || "Project Name", href: undefined }
  ];

  return (
    <div className="bg-[#0F1518] font-sans pb-10">
      <GenericBreadcrums items={breadcrumbItems} />

      <div className="flex justify-between items-center text-4xl text-[#E6F0E6] font-bold my-6">
        Worker
        {isOwner && (
          <GenericGreenButton name="New Worker" href={`/projects/${projectId}/workers/create`} icon={<CreateWorkerIcon />} />
        )}
      </div>

      {/* Stats Summary Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Workers", value: workerInfo.total, color: "#FBFBFB", icon: <TotalIcon /> },
          { label: "Online Status", value: workerInfo.online, color: "#8FFF9C", icon: <OnlineIcon /> },
          { label: "Busy (Loading)", value: workerInfo.busy, color: "#FFCC00", icon: <BusyIcon /> },
          { label: "Total Jobs", value: workerInfo.total_jobs, color: "#007AFF", icon: <JobIcon /> },
        ].map((item, i) => (
          <Box key={i} sx={{ bgcolor: "#1E2429", p: 2.5, borderRadius: "16px", border: "1px solid #404F57", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ color: item.color, fontWeight: 900 }}>{item.value}</Typography>
              <Typography sx={{ color: "#9AA6A8", fontSize: "11px", fontWeight: 800, textTransform: 'uppercase' }}>{item.label}</Typography>
            </Box>
            <Box sx={{ width: 44, height: 44, borderRadius: "12px", display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, bgcolor: `${item.color}10` }}>{item.icon}</Box>
          </Box>
        ))}
      </div>

      {/* Toolbar Area */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={2} sx={{ flex: 1, maxWidth: 600 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#1A2023', px: 2, py: 0.5, borderRadius: '10px', border: '1px solid #2A3033', flex: 1, '&:focus-within': { borderColor: '#8FFF9C' } }}>
            <SearchIcon sx={{ color: '#404F57', mr: 1, fontSize: 20 }} />
            <InputBase placeholder="Search by name, hostname, or IP..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ color: '#E6F0E6', fontSize: '14px', width: '100%' }} />
          </Box>
          <Button variant="outlined" onClick={(e) => setAnchorEl(e.currentTarget)} startIcon={<FilterIcon />} sx={{ color: statusFilter !== "ALL" ? "#8FFF9C" : "#9AA6A8", borderColor: statusFilter !== "ALL" ? "#8FFF9C" : "#2A3033", textTransform: 'none', borderRadius: '10px' }}>
            {statusFilter === "ALL" ? "Filter" : statusFilter.toUpperCase()}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} sx={{ "& .MuiPaper-root": { bgcolor: "#1A2023", color: "#E6F0E6" } }}>
            {["ALL", "online", "offline", "busy"].map((status) => (
              <MenuItem key={status} onClick={() => { setStatusFilter(status); setAnchorEl(null); }}>{status.toUpperCase()}</MenuItem>
            ))}
          </Menu>
        </Stack>

        {isOwner && totalCnt > 0 && (
          <Button variant="text" startIcon={<UnlinkIcon />} onClick={handleUnlinkAllClick} sx={{ color: '#FE3B46', fontWeight: 'bold', textTransform: 'none' }}>Unlink All Workers</Button>
        )}
      </Box>

      {/* Content Area */}
      <div className="flex-1">
        {isLoading ? (
          <Box sx={{ textAlign: "center", py: 10 }}><CircularProgress sx={{ color: "#8FFF9C" }} /></Box>
        ) : workers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 scrollbar-hide">
              {workers.map((worker: WorkerType) => (
                <Link key={worker.id} href={`/projects/${projectId}/workers/${worker.id}`} className="block no-underline">
                  <WorkerCard 
                    worker={worker} canManage={isOwner}
                    isDownloading={downloadingId === worker.id && isDownloading}
                    onDownload={(e) => handleDownload(e, worker.id, worker.name)}
                    onDelete={(e, w) => { e.stopPropagation(); e.preventDefault(); deleteState.handleDeleteClick(w); }}
                    onUnlink={(e, w) => { e.stopPropagation(); e.preventDefault(); handleUnlinkClick(w); }}
                  />
                </Link>
              ))}
            </div>
            <GenericPagination 
              count={totalCnt}
              page={page}
              rowsPerPage={rowsPerPage}
              
              // เมื่อเปลี่ยนหน้า: เรียกใช้ handleChangePage ของ useTable 
              // (ส่ง null เป็น event เพราะ hook ต้องการ event เป็นตัวแรก)
              onPageChange={(newPage) => handleChangePage(null, newPage)}
              
              // เมื่อเปลี่ยนขนาด: เรียกใช้ handleChangeRowsPerPage โดยจำลอง event object
              onRowsPerPageChange={(newSize) => {
                const mockEvent = { target: { value: newSize.toString() } } as React.ChangeEvent<HTMLInputElement>;
                handleChangeRowsPerPage(mockEvent);
              }}
              
              labelRowsPerPage="Workers per page:"
              rowsPerPageOptions={[6, 12, 24]}
            />
          </>
        ) : (
          <Box sx={{ py: 10, textAlign: 'center', border: '1px dashed #2A3033', borderRadius: '16px' }}><Typography sx={{ color: '#404F57' }}>No workers found matching your criteria.</Typography></Box>
        )}
      </div>

      {/* Modals */}
      {isOwner && deleteState.target && (
        <GenericDeleteModal open={deleteState.isOpen} onClose={() => deleteState.setIsOpen(false)} onConfirm={deleteState.handleConfirmDelete} entityType="Worker" entityName={deleteState.target.name} loading={deleteState.isLoading} />
      )}
      <WorkerUnlinkModal open={unlinkModal.open} onClose={() => setUnlinkModal(p => ({ ...p, open: false }))} onConfirm={handleConfirmUnlink} workerName={unlinkModal.isAll ? "ALL workers" : (unlinkModal.target?.name || "")} loading={unlinkModal.loading} />
    </div>
  );
}