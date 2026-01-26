"use client"

import { useWorkerPage } from "@/src/hooks/worker/use-workerPage";
import { useWorkers } from "@/src/hooks/worker/use-workers";
import { useTable } from "@/src/hooks/use-table";

import { WorkerTable } from "@/src/components/workers/WorkerTable"; 
import { CreateWorkerModal } from "@/src/components/workers/CreateModal";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import CreateWorkerIcon from "@/src/components/icon/CreateWorker";

import { muiGreenButtonStyle } from "@/src/styles/greenButton";

import { Button } from "@mui/material";


export default function WorkersPage() {

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

  const { data: response, isLoading, isError, refetch } = useWorkers(
    page + 1, 
    rowsPerPage, 
    sortBy, 
    sortOrder, 

  );

  const { createState, deleteState } = useWorkerPage(refetch);

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

  return (
    <div className="mx-12 bg-[#0F1518]">
      <div className="flex justify-between items-center text-4xl text-[#E6F0E6] font-bold my-6">
        Worker
        
        <Button
          variant="contained"
          onClick={()=> createState.setIsOpen(true)}
          sx={muiGreenButtonStyle}
        >
          <div className="flex justify-around gap-3 font-bold">
            New Worker
            <CreateWorkerIcon />
          </div>
        </Button>
      </div>

      <CreateWorkerModal
        open={createState.isOpen}
        onClose={() => createState.setIsOpen(false)}
        onConfirm={createState.handleCreate} // ส่งฟังก์ชันไป
        loading={createState.isLoading}
      />

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
