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

  const isOwner = project?.role === "owner";

  // ดึง items และ total จาก response (Handle กรณี response เป็น undefined)
  const workers = response?.items || [];
  const totalCnt = response?.total || 0;

  if (isLoading || isProjectLoading) {
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
    <div className="mx-12 bg-[#0F1518] font-sans">
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

      {totalCnt === 0 ? (
        <div className="text-center py-20 bg-[#1E2429] border border-[#404F57] rounded-xl text-gray-400">
          ยังไม่มีข้อมูล Worker {isOwner && "กดปุ่มด้านบนเพื่อเพิ่มรายการใหม่"}
        </div>
      ) : (
        <WorkerTable 
          data={workers}
          totalCount={totalCnt}
          page={page}
          rowsPerPage={rowsPerPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onSort={handleSort}
          // ส่งสิทธิ์ isOwner เข้าไปใน Table เพื่อซ่อน/แสดงปุ่ม Edit และ Delete ในแต่ละแถว
          // canManage={isOwner} 
          onDeleteClick={deleteState.handleDeleteClick}
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
