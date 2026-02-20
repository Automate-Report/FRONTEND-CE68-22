"use client"
import { use, useState, useEffect } from "react";
import { useProject } from "@/src/hooks/project/use-project";
import { useWorkerPage } from "@/src/hooks/worker/use-workerPage";
import { useWorkers } from "@/src/hooks/worker/use-workers";
import { useTable } from "@/src/hooks/use-table";

import { WorkerTable } from "@/src/components/workers/WorkerTable"; 
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import CreateWorkerIcon from "@/src/components/icon/CreateWorker";

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

  const { deleteState } = useWorkerPage(refetch);

  // ดึง items และ total จาก response (Handle กรณี response เป็น undefined)
  const workers = response?.items || [];
  const totalCnt = response?.total || 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Skeleton Loader แบบบ้านๆ */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 border border-red-200 bg-red-50 text-red-600 rounded-lg text-center">
        เกิดข้อผิดพลาดในการดึงข้อมูล ไม่สามารถเชื่อมต่อกับ Backend ได้
      </div>
    );
  }

  const breadcrumbItems = [
        { label: "Home", href: "/main"},
        { label: project?.name || "Project Name", href: undefined}
    ];

  return (
    <div className="mx-12 bg-[#0F1518]">
      <div className="w-full">
        <GenericBreadcrums items={breadcrumbItems} />
      </div>
      <div className="flex justify-between items-center text-4xl text-[#E6F0E6] font-bold my-6">
        Worker
        < GenericGreenButton
          name="New Worker"
          href={`/projects/${projectId}/workers/create`}
          icon={<CreateWorkerIcon />}
        />
      </div>

      {totalCnt === 0 ? (
        <div className="text-center py-20 bg-gray-800 rounded-lg text-gray-400">
             ยังไม่มีข้อมูล Worker กดปุ่มด้านบนเพื่อเพิ่มรายการใหม่
        </div>
      ) : (
        <WorkerTable 
          data={workers}           // ข้อมูล Array ของหน้านั้นๆ
          totalCount={totalCnt}   // จำนวนข้อมูลทั้งหมดใน DB (เพื่อคำนวณจำนวนหน้า)
                
          // State
          page={page}
          rowsPerPage={rowsPerPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
                
          // Functions (Actions)
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onSort={handleSort}
          onDeleteClick={deleteState.handleDeleteClick}
        />
      )}

      
      {/* เรียกใช้ Generic Modal */}
      {deleteState.target && (
        <GenericDeleteModal
          open={deleteState.isOpen}
          onClose={() => deleteState.setIsOpen(false)}
          onConfirm={deleteState.handleConfirmDelete}
                
          // --- จุดที่ส่งข้อมูล ---
          entityType="Worker"             // บอกว่าเป็น "Project"
          entityName={deleteState.target.name} // ส่งชื่อโปรเจกต์ไป
          loading={deleteState.isLoading}
        />
      )}
    </div>
  );
}
