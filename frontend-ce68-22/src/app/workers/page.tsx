"use client";

import { useState } from "react";
import { useWorkers } from "../../hooks/use-workers";
import { WorkerTable } from "@/src/components/workers/WorkerTable"; 
import { useTable } from "@/src/hooks/use-table";
import { Worker } from "@/src/types/worker";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { workerService } from "../../services/worker.service";

import CreateWorkerIcon from "@/src/components/icon/CreateWorker";
import { CreateWorkerModal } from "@/src/components/workers/CreateModal";
import { CreateWorkerPayload } from "@/src/types/worker";


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
  } = useTable<Worker>([]);

  const { data: response, isLoading, isError, refetch } = useWorkers(
    page + 1, 
    rowsPerPage, 
    sortBy, 
    sortOrder, 

  );

  // ใช้ตอนสร้าง worker เป็น modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ใช้ตอน delete worker ใน table
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  // function create worker
  const handleCreateWorker = async (workerName: string) => {
    console.log("Creating worker:", workerName);
    try {
      const payload: CreateWorkerPayload = {
        name: workerName
      }
      await workerService.create(payload);
          
      setIsCreateModalOpen(false);
      refetch(); // *สำคัญ* ดึงข้อมูลใหม่
          
    } catch (error) {
      console.error("Failed to create", error);
      alert("Failed to create worker"); // หรือใช้ Snackbar/Toast
    }
    setIsCreateModalOpen(false);
  };

  // function delete worker
  const handleDeleteClick = (worker: Worker) => {
    setWorkerToDelete(worker);
    setDeleteModalOpen(true);
  };

  // เมื่อกดยืนยันใน Modal
  const handleConfirmDelete = async () => {
    if (!workerToDelete) return;
    
    setIsDeleting(true);
    try {
      await workerService.delete(workerToDelete.id);
      
      // ลบสำเร็จ -> ปิด Modal -> โหลดตารางใหม่
      setDeleteModalOpen(false);
      setWorkerToDelete(null);
      refetch(); // *สำคัญ* ดึงข้อมูลใหม่
      
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete project"); // หรือใช้ Snackbar/Toast
    } finally {
      setIsDeleting(false);
    }
  };

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

  if (totalCnt === 0) {
     // ... แสดงหน้า Empty State ตามเดิม ...
     return <div className="text-center py-10">ไม่พบ Worker</div>;
  }



  return (
    <div className="mx-auto w-11/12 bg-[#0F1518]">
      <div className="flex justify-between items-center text-4xl text-[#E6F0E6] font-bold pb-10">
        Worker
        
        <Button
          variant="contained"
          onClick={()=> setIsCreateModalOpen(true)}
          sx={{
            borderRedius: "8px",
            padding: "12px 24px",
            backgroundColor: "#8FFF9C",
            color: "#0B0F12"
          }}
        >
          <div className="flex justify-around gap-3 font-bold">
            New Worker
            <CreateWorkerIcon />
          </div>
        </Button>
      </div>

      <CreateWorkerModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={handleCreateWorker} // ส่งฟังก์ชันไป
        loading={loading}
      />

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
        onDeleteClick={handleDeleteClick}
      />
      {/* เรียกใช้ Generic Modal */}
      {workerToDelete && (
        <GenericDeleteModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
                
          // --- จุดที่ส่งข้อมูล ---
          entityType="Worker"             // บอกว่าเป็น "Project"
          entityName={workerToDelete.name} // ส่งชื่อโปรเจกต์ไป
          loading={isDeleting}
        />
      )}
    </div>
  );
}
