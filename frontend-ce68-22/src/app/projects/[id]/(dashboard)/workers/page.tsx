"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useProject } from "@/src/hooks/project/use-project";
import { useWorkerPage } from "@/src/hooks/worker/use-workerPage";
import { useWorkers } from "@/src/hooks/worker/use-workers";
import { useWorkerInfoSummary } from "@/src/hooks/worker/use-workerInfoSummary";
import { useTable } from "@/src/hooks/use-table";
import { useDebounce } from "@/src/hooks/use-debounce";
import { useDownloadStore } from "@/src/hooks/worker/use-WorkerDownloadStore";
import { toast } from "react-hot-toast";
import { workerService } from "@/src/services/worker.service";
import { Worker as WorkerType } from "@/src/types/worker";
import { getMe } from "@/src/services/auth.service";

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
  LinkOff as UnlinkIcon
} from "@mui/icons-material";
import Link from "next/link";
import CardWithIcon from "@/src/components/Common/CardWithIcon";
import { INPUT_BOX_WITH_ICON_STYLE_DIV, INPUT_BOX_WITH_ICON_STYLE_INPUT } from "@/src/styles/inputBoxStyle";
import { FILTER_BUTTON_STYLE, RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";
import FilterIcon from "@/src/components/icon/Filter";
import MagIcon from "@/src/components/icon/MagnifyingGlass";

interface PageProps { params: Promise<{ id: string }>; }

export default function WorkersPage({ params }: PageProps) {
  const resolvePrams = use(params);
  const projectId = parseInt(resolvePrams.id);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Filter by Status
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const filterOptions = [
    { label: "All Status", value: "ALL" },
    { label: "Online", value: "online" },
    { label: "Offline", value: "offline" },
    { label: "Not Activated", value: "notActivated" },
    { label: "Available", value: "available" },
    { label: "In Use", value: "inUse" },
  ];

  // ✅ เก็บชื่อผู้ใช้เพื่อนำไปเทียบกับ worker.owner
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  const [unlinkModal, setUnlinkModal] = useState<{ open: boolean; target: WorkerType | null; isAll: boolean; loading: boolean }>({
    open: false, target: null, isAll: false, loading: false,
  });

  const startDownload = useDownloadStore((state) => state.startDownload);
  const { page, rowsPerPage, sortBy, sortOrder, handleChangePage, handleChangeRowsPerPage } = useTable();
  const { data: project } = useProject(projectId);
  const { data: response, isLoading, refetch } = useWorkers(projectId, page + 1, rowsPerPage, sortBy, sortOrder, debouncedSearch, statusFilter);
  const { data: workerInfo = { total: 0, online: 0, busy: 0, total_jobs: 0 } } = useWorkerInfoSummary(projectId);
  const { deleteState } = useWorkerPage(refetch);

  useEffect(() => {
    handleChangePage(null, 0);
  }, [debouncedSearch, statusFilter, handleChangePage]);

  // ใน WorkersPage.tsx ส่วน useEffect ดึงข้อมูล user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        // ✅ สำคัญ: ต้องเป็นฟิลด์เดียวกับที่ API ส่งมาใน worker.owner (มักจะเป็น Name หรือ Username)
        setCurrentUserId(res?.["user"]);
      } catch (error) { console.error(error); }
    };
    fetchUser();
  }, []);

  const handleDownload = useCallback(async (e: React.MouseEvent, workerId: number, workerName: string) => {
    e.preventDefault(); e.stopPropagation();
    await startDownload(workerId, projectId, workerName, async () => { refetch(); });
  }, [startDownload, projectId, refetch]);

  const handleUnlinkClick = (e: React.MouseEvent, worker: WorkerType) => {
    e.preventDefault(); e.stopPropagation();
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
        toast.success("All workers disconnected");
      } else if (unlinkModal.target) {
        await workerService.unLink(unlinkModal.target.id, projectId);
        toast.success("Worker disconnected");
      }
      setUnlinkModal({ open: false, target: null, isAll: false, loading: false });
      refetch();
    } catch (error) { toast.error("Action failed"); }
    finally { setUnlinkModal(prev => ({ ...prev, loading: false })); }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (value?: string) => {
    if (value) {
      setStatusFilter(value);
      handleChangePage(null, 0); // รีเซ็ตไปหน้าแรกเมื่อเปลี่ยนฟิลเตอร์
    }
    setAnchorEl(null);
  };

  const isOwner = project?.role === "owner";
  const isPentester = project?.role === "pentester";
  const workers = response?.items || [];
  const totalCnt = response?.total || 0;

  return (
    <div>
      <GenericBreadcrums items={[{ label: "Home", href: "/main" }, { label: project?.name || "Project", href: undefined }]} />
      <div className="flex justify-between items-center text-4xl text-[#E6F0E6] font-bold my-6">
        Worker Nodes
        {isOwner && <GenericGreenButton name="New Worker" href={`/projects/${projectId}/workers/create`} icon={<CreateWorkerIcon />} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Workers", value: workerInfo.total, color: "#FBFBFB", icon: <TotalIcon /> },
          { label: "Online Status", value: workerInfo.online, color: "#8FFF9C", icon: <OnlineIcon /> },
          { label: "Busy Status", value: workerInfo.busy, color: "#FFCC00", icon: <BusyIcon /> },
          { label: "Processed Jobs", value: workerInfo.total_jobs, color: "#007AFF", icon: <JobIcon /> },
        ].map((item, i) => (
          <CardWithIcon
            key={i}
            icon={item.icon}
            title={item.label}
            dataDisplay={item.value}
            dataDisplayColor={item.color}
            iconColor={item.color}
            dataDisplaySize="24px"
            description=""
          />
        ))}
      </div>

      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="flex flex-row gap-2 flex-1 max-w-xl">

          {/* Search */}
          <div className={`${INPUT_BOX_WITH_ICON_STYLE_DIV} w-full`}>
            <MagIcon />
            <input
              type="text"
              placeholder="Search nodes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${INPUT_BOX_WITH_ICON_STYLE_INPUT} w-full`}
            />
          </div>

          {/* Filter Button */}
          <div className="relative">

            {/* Trigger */}
            <button
              onClick={handleFilterClick}
              className={`${FILTER_BUTTON_STYLE} whitespace-nowrap`}
            >
              {filterOptions.find(opt => opt.value === statusFilter)?.label || "Filter"}
              <FilterIcon />
            </button>

            {/* Dropdown Menu */}
            {Boolean(anchorEl) && (
              <div className="absolute z-10 mt-1 w-full bg-[#0F1518] border-[2px] border-[#404F57]
                        rounded-xl shadow max-h-48 overflow-auto">
                {filterOptions.map(opt => (
                  <div
                    key={String(opt.value)}
                    onClick={() => {
                      handleFilterClose(opt.value)
                    }}
                    className={`relative flex items-center h-[42px] rounded-xl pl-3 shadow-sm transition text-[#E6F0E6] placeholder-[#9AA6A8] focus:outline-none
                                hover:bg-[#1D2226] cursor-pointer
                                ${statusFilter === opt.value
                        ? "bg-[#2D353B] font-semibold hover:bg-[#2D353B]"
                        : ""
                      }`}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Unlink All */}
        {isOwner && totalCnt > 0 && (
          <button
            onClick={handleUnlinkAllClick}
            className={RED_BUTTON_STYLE}
          >
            <UnlinkIcon className="w-4 h-4" />
            Unlink All Workers
          </button>
        )}
      </div>

      <div className="flex-1">
        {isLoading ? (
          <Box sx={{ textAlign: "center", py: 10 }}><CircularProgress sx={{ color: "#8FFF9C" }} /></Box>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {workers.map((worker: WorkerType) => (
                <Link key={worker.id} href={`/projects/${projectId}/workers/${worker.id}`} className="block no-underline">
                  <WorkerCard
                    worker={worker}
                    canManage={isOwner || isPentester}
                    isProjectOwner={isOwner}
                    currentUserId={currentUserId}
                    onDownload={(e) => handleDownload(e, worker.id, worker.name)}
                    onDelete={(e, w) => { e.preventDefault(); e.stopPropagation(); deleteState.handleDeleteClick(w); }}
                    onUnlink={(e, w) => handleUnlinkClick(e, w)}
                  />
                </Link>
              ))}
            </div>
            <GenericPagination count={totalCnt} page={page} rowsPerPage={rowsPerPage} onPageChange={(_, p) => handleChangePage(null, p)} onRowsPerPageChange={(s) => handleChangeRowsPerPage({ target: { value: s.toString() } } as any)} rowsPerPageOptions={[6, 12, 24]} />
          </>
        )}
      </div>

      <WorkerUnlinkModal open={unlinkModal.open} onClose={() => setUnlinkModal(p => ({ ...p, open: false }))} onConfirm={handleConfirmUnlink} workerName={unlinkModal.target?.name || ""} loading={unlinkModal.loading} />
      {deleteState.target && <GenericDeleteModal open={deleteState.isOpen} onClose={() => deleteState.setIsOpen(false)} onConfirm={deleteState.handleConfirmDelete} entityType="Worker" entityName={deleteState.target.name} loading={deleteState.isLoading} />}
    </div>
  );
}