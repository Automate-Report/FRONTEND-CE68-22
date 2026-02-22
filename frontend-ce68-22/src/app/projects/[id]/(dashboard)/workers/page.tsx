"use client";

import { use, useState, useEffect } from "react";
import { useProject } from "@/src/hooks/project/use-project";
import { useWorkerPage } from "@/src/hooks/worker/use-workerPage";
import { useWorkers } from "@/src/hooks/worker/use-workers";
import { useWorkerInfoSummary } from "@/src/hooks/worker/use-workerInfoSummary";
import { useTable } from "@/src/hooks/use-table";
import { useDebounce } from "@/src/hooks/use-debounce"; // ต้องมี hook นี้

import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { GenericPagination } from "@/src/components/Common/GenericPagination";
import CreateWorkerIcon from "@/src/components/icon/CreateWorker";

import { WorkerCard } from "@/src/components/workers/WorkerCard";

import { Box, Typography, InputBase, Button, Stack, MenuItem, Menu } from "@mui/material";
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

  const {
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTable();

  const { data: project, isLoading: isProjectLoading } = useProject(projectId);

  // อัปเดต useWorkers ให้รับ search และ filter (ตรวจสอบว่า hook ของคุณรองรับพารามิเตอร์เหล่านี้)
  const { data: response, isLoading, refetch } = useWorkers(
    projectId,
    page + 1, 
    rowsPerPage, 
    sortBy, 
    sortOrder,
    debouncedSearch, // ส่งคำค้นหา
    statusFilter     // ส่งฟิลเตอร์สถานะ
  );

  const { data: workerInfo = { total: 0, online: 0, busy: 0, total_jobs: 0 } } = useWorkerInfoSummary(projectId);
  const { deleteState } = useWorkerPage(refetch);

  // รีเซ็ตหน้ากลับไปที่ 0 เมื่อมีการค้นหาหรือเปลี่ยนฟิลเตอร์
  useEffect(() => {
    // ใช้ handleChangePage(null, 0) เพื่อสั่งให้กลับไปหน้าแรก (หน้า 0)
    handleChangePage(null, 0);
  }, [debouncedSearch, statusFilter, handleChangePage]);

  const isOwner = project?.role === "owner";
  const workers = response?.items || [];
  const totalCnt = response?.total || 0;

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterSelect = (status: string) => {
    setStatusFilter(status);
    setAnchorEl(null);
  };

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
          <GenericGreenButton
            name="New Worker"
            href={`/projects/${projectId}/workers/create`}
            icon={<CreateWorkerIcon />}
          />
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
            <Box sx={{ width: 44, height: 44, borderRadius: "12px", display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, bgcolor: `${item.color}10` }}>
              {item.icon}
            </Box>
          </Box>
        ))}
      </div>

      {/* --- Toolbar: Search & Filter --- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={2} sx={{ flex: 1, maxWidth: 600 }}>
          <Box sx={{ 
            display: 'flex', alignItems: 'center', bgcolor: '#1A2023', px: 2, py: 0.5, 
            borderRadius: '10px', border: '1px solid #2A3033', flex: 1, '&:focus-within': { borderColor: '#8FFF9C' }
          }}>
            <SearchIcon sx={{ color: '#404F57', mr: 1, fontSize: 20 }} />
            <InputBase 
              placeholder="Search by name, hostname, or IP..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ color: '#E6F0E6', fontSize: '14px', width: '100%' }} 
            />
          </Box>
          
          <Button 
            variant="outlined" 
            onClick={handleFilterClick}
            startIcon={<FilterIcon />} 
            sx={{ 
              color: statusFilter !== "ALL" ? "#8FFF9C" : "#9AA6A8", 
              borderColor: statusFilter !== "ALL" ? "#8FFF9C" : "#2A3033", 
              textTransform: 'none', borderRadius: '10px', px: 3 
            }}
          >
            {statusFilter === "ALL" ? "Filter" : statusFilter.toUpperCase()}
          </Button>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} sx={{ "& .MuiPaper-root": { bgcolor: "#1A2023", color: "#E6F0E6", border: "1px solid #2A3033" } }}>
            {["ALL", "online", "offline", "busy"].map((status) => (
              <MenuItem key={status} onClick={() => handleFilterSelect(status)} sx={{ fontSize: "14px", textTransform: "uppercase", "&:hover": { bgcolor: "#2A3033" } }}>
                {status}
              </MenuItem>
            ))}
          </Menu>
        </Stack>

        {isOwner && (
          <Button variant="text" startIcon={<UnlinkIcon />} sx={{ color: '#FE3B46', fontWeight: 'bold', textTransform: 'none', '&:hover': { bgcolor: 'rgba(254, 59, 70, 0.1)' } }}>
            Unlink All Workers
          </Button>
        )}
      </Box>

      {/* Workers Grid */}
      {isLoading ? (
        <Typography sx={{ color: "#404F57", textAlign: "center", py: 10 }}>Searching workers...</Typography>
      ) : workers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 scrollbar-hide">
          {workers.map((worker) => (
            <Link key={worker.id} href={`/projects/${projectId}/workers/${worker.id}`} className="block no-underline">
              <WorkerCard 
                worker={worker}
                canManage={isOwner}
                onDelete={(e, w) => {
                  e.stopPropagation();
                  e.preventDefault();
                  deleteState.handleDeleteClick(w);
                }}
              />
            </Link>
          ))}
        </div>
      ) : (
        <Box sx={{ py: 10, textAlign: 'center', border: '1px dashed #2A3033', borderRadius: '16px' }}>
            <Typography sx={{ color: '#404F57' }}>No workers found matching your criteria.</Typography>
        </Box>
      )}

      {/* Pagination */}
      {totalCnt > 0 && (
        <GenericPagination 
          count={totalCnt}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage, newSize) => {
             handleChangePage(null, newPage);
             if(newSize !== rowsPerPage) {
                const mockEvent = { target: { value: newSize.toString() } } as React.ChangeEvent<HTMLInputElement>;
                handleChangeRowsPerPage(mockEvent);
             }
          }}
          rowsPerPageOptions={[6, 12, 24]}
          labelRowsPerPage="Workers per page:"
        />
      )}

      {isOwner && deleteState.target && (
        <GenericDeleteModal
          open={deleteState.isOpen}
          onClose={() => deleteState.setIsOpen(false)}
          onConfirm={deleteState.handleConfirmDelete}
          entityType="Worker"
          entityName={deleteState.target.name}
          loading={deleteState.isLoading}
        />
      )}
    </div>
  );
}