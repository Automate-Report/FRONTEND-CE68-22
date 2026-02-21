"use client"
import { use } from "react";
import { useProject } from "@/src/hooks/project/use-project";
import { useWorkerPage } from "@/src/hooks/worker/use-workerPage";
import { useWorkers } from "@/src/hooks/worker/use-workers";
import { useWorkerInfoSummary } from "@/src/hooks/worker/use-workerInfoSummary";
import { useTable } from "@/src/hooks/use-table";

import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import CreateWorkerIcon from "@/src/components/icon/CreateWorker";

import { WorkerCard } from "@/src/components/workers/WorkerCard";
import { WorkerPagination } from "@/src/components/workers/WorkerPagination";

import { Box, Typography, InputBase, Button, Stack } from "@mui/material";
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


interface PageProps{
  params: Promise<{ id: string}>;
}

export default function WorkersPage({ params }: PageProps) {

  const resolvePrams = use(params);
  const projectId = parseInt(resolvePrams.id);

  // ใช้กับ table 
  const {
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSort,
  } = useTable();

  const { data: project, isLoading: isProjectLoading, isError: isProjectError} = useProject(projectId);

  const { data: response, isLoading, isError, refetch } = useWorkers(
    projectId,
    page + 1, 
    rowsPerPage, 
    sortBy, 
    sortOrder, 

  );

  const { 
  data: workerInfo = { total: 0, online: 0, busy: 0, total_jobs: 0 }, // กำหนดค่า Default ตรงนี้
  isLoading: workerInfoLoading 
} = useWorkerInfoSummary(projectId);

  const { deleteState } = useWorkerPage(refetch);

  const isOwner = project?.role === "owner";

  // ดึง items และ total จาก response (Handle กรณี response เป็น undefined)
  const workers = response?.items || [];
  const totalCnt = response?.total || 0;

  if (isLoading || isProjectLoading || workerInfoLoading) {
    return (
      <div className="mx-12 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-800/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || isProjectError) {
    return (
      <div className="mx-12 mt-10 p-8 border border-red-900/50 bg-red-950/20 text-red-500 rounded-lg text-center">
        เกิดข้อผิดพลาดในการดึงข้อมูล ไม่สามารถเชื่อมต่อกับ Backend ได้
      </div>
    );
  }

  const breadcrumbItems = [
        { label: "Home", href: "/main"},
        { label: project?.name || "Project Name", href: undefined}
    ];

  return (
    <div className="bg-[#0F1518] font-sans pb-10">
      <div className="w-full">
        <GenericBreadcrums items={breadcrumbItems} />
      </div>

      <div className="flex justify-between items-center text-4xl text-[#E6F0E6] font-bold my-6">
        Worker
        {/* แสดงปุ่ม New Worker เฉพาะ Owner เท่านั้น */}
        {isOwner && (
          <GenericGreenButton
            name="New Worker"
            href={`/projects/${projectId}/workers/create`}
            icon={<CreateWorkerIcon />}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { 
            label: "Total Workers", 
            value: workerInfo?.total ?? 0, 
            color: "#FBFBFB", 
            icon: <TotalIcon sx={{ fontSize: 24 }} /> 
          },
          { 
            label: "Online Status", 
            value: workerInfo?.online ?? 0, 
            color: "#8FFF9C", 
            icon: <OnlineIcon sx={{ fontSize: 24 }} /> 
          },
          { 
            label: "Busy (Loading)", 
            value: workerInfo?.busy ?? 0, 
            color: "#FFCC00", 
            icon: <BusyIcon sx={{ fontSize: 24 }} /> 
          },
          { 
            label: "Total Jobs", 
            value: workerInfo?.total_jobs ?? 0, 
            color: "#007AFF", 
            icon: <JobIcon sx={{ fontSize: 24 }} /> 
          },
        ].map((item, i) => (
          <Box 
            key={i} 
            sx={{ 
              bgcolor: "#1E2429", 
              p: 2.5, 
              borderRadius: "16px", 
              border: "1px solid #404F57", 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' } // เพิ่มลูกเล่นตอน hover นิดหน่อยครับ
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ color: item.color, fontWeight: 900, lineHeight: 1 }}>
                {item.value}
              </Typography>
              <Typography sx={{ color: "#9AA6A8", fontSize: "11px", fontWeight: 800, textTransform: 'uppercase', mt: 0.5 }}>
                {item.label}
              </Typography>
            </Box>
            <Box 
              sx={{ 
                width: 44, 
                height: 44, 
                borderRadius: "12px", 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: item.color, 
                bgcolor: `${item.color}10`, // สีพื้นหลังไอคอนแบบจางๆ 10%
                border: `1px solid ${item.color}25` // ขอบไอคอนแบบจางๆ 25%
              }}
            >
              {item.icon}
            </Box>
          </Box>
        ))}
      </div>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3, 
        gap: 2,
        flexWrap: 'wrap' 
      }}>
        {/* ฝั่งซ้าย: Search & Filter */}
        <Stack direction="row" spacing={2} sx={{ flex: 1, maxWidth: 600 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: '#1A2023', 
            px: 2, 
            py: 0.5, 
            borderRadius: '10px', 
            border: '1px solid #2A3033',
            flex: 1,
            '&:focus-within': { borderColor: '#8FFF9C' }
          }}>
            <SearchIcon sx={{ color: '#404F57', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="Search by worker name, IP, or ID..."
              sx={{ color: '#E6F0E6', fontSize: '14px', width: '100%' }}
            />
          </Box>
          
          <Button 
            variant="outlined" 
            startIcon={<FilterIcon />}
            sx={{ 
              color: '#9AA6A8', 
              borderColor: '#2A3033', 
              textTransform: 'none',
              borderRadius: '10px',
              px: 3,
              '&:hover': { borderColor: '#8FFF9C', color: '#8FFF9C', bgcolor: 'rgba(143, 255, 156, 0.05)' }
            }}
          >
            Filter
          </Button>
        </Stack>

        {/* ฝั่งขวา: Unlink All (เฉพาะ Owner) */}
        {isOwner && (
          <Button
            variant="text"
            startIcon={<UnlinkIcon />}
            sx={{ 
              color: '#FE3B46', 
              fontWeight: 'bold', 
              textTransform: 'none',
              fontSize: '14px',
              '&:hover': { bgcolor: 'rgba(254, 59, 70, 0.1)' }
            }}
          >
            Unlink All Workers
          </Button>
        )}
      </Box>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 scrollbar-hide">
        {workers.map((worker) => (
          <Link
            key={worker.id}
            href={`/projects/${projectId}/workers/${worker.id}`}
            className="block no-underline"
          >
            <WorkerCard 
              worker={worker}
              canManage={isOwner}
              // แก้ไขการส่งค่าให้ตรงกับ Interface ใหม่
              onEdit={(e) => {
                e.stopPropagation();
                e.preventDefault(); // กันไว้สองชั้น
                console.log("Edit clicked");
              }}
              onDelete={(e, w) => {
                e.stopPropagation();
                e.preventDefault();
                deleteState.handleDeleteClick(w);
              }}
              onDownload={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log("Download clicked");
              }}
            />
          </Link>
        ))}
      </div>

      {/* เพิ่ม Pagination เข้าไปตรงนี้ */}
      {totalCnt > 0 && (
        <WorkerPagination 
          totalCount={totalCnt}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => handleChangePage(null, newPage)}
          // แก้ตรงนี้: สร้าง mock event เพื่อให้เข้ากับ hook เดิม หรือส่งค่าตรงๆ
          onRowsPerPageChange={(value) => {
            const mockEvent = {
              target: { value: value.toString() }
            } as React.ChangeEvent<HTMLInputElement>;
            handleChangeRowsPerPage(mockEvent);
          }}
        />
      )}

      {/* เรียกใช้ Generic Modal เฉพาะเมื่อเป็น Owner และมีการกดลบ */}
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
