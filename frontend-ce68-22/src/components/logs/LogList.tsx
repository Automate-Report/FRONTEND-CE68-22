"use client";

import { useState, useEffect } from "react";
import { usePenTestLogs } from "@/src/hooks/log/use-penTestLogs";
import { PenTestLog } from "@/src/types/pentest_log";
import { useTable } from "@/src/hooks/use-table";
import { GenericDeleteModal } from "../Common/GenericDeleteModal";
import { penTestLogService } from "@/src/services/penTestLog.service";
import { PenTestLogTable } from "./LogTable";

//นิยาม Interface สำหรับ Props
interface PenTestLogListProps {
  searchQuery: string;
  filterStatus: string;
  project_id: number;
  role?: string;
}


export function PenTestLogList({ searchQuery, filterStatus, project_id, role }: PenTestLogListProps) {

  const {
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSort,
  } = useTable<PenTestLog>();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<PenTestLog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  //(สำคัญ) เมื่อ Search หรือ Filter เปลี่ยน ควร reset page กลับไปหน้าแรก
  useEffect(() => {
     handleChangePage(null, 0); 
     // หมายเหตุ: ต้องเช็คว่า handleChangePage ของคุณรองรับ event null หรือไม่ 
     // ถ้าไม่รองรับ อาจต้องใช้ setPage(0) ตรงๆ (ถ้า useTable expose ออกมา)
  }, [searchQuery, filterStatus]);

  const { data: response, isLoading, isError, refetch } = usePenTestLogs(
    project_id,
    page + 1, 
    rowsPerPage, 
    sortBy, 
    sortOrder, 
    searchQuery,
    filterStatus
  );


  const handleDeleteClick = (log: PenTestLog) => {
    setLogToDelete(log);
    setDeleteModalOpen(true);
  };

  // 2. เมื่อกดยืนยันใน Modal
  const handleConfirmDelete = async () => {
    if (!logToDelete) return;
    
    setIsDeleting(true);
    try {
      await penTestLogService.delete(logToDelete.id);
      
      // ลบสำเร็จ -> ปิด Modal -> โหลดตารางใหม่
      setDeleteModalOpen(false);
      setLogToDelete(null);
      refetch(); // *สำคัญ* ดึงข้อมูลใหม่
      
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete asset"); // หรือใช้ Snackbar/Toast
    } finally {
      setIsDeleting(false);
    }
  };



  // ดึง items และ total จาก response (Handle กรณี response เป็น undefined)
  const reports = response?.items || [];
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
     return <div className="text-center py-10">ไม่พบ Log</div>;
  }

  return (
    <div>
      <PenTestLogTable
        project_id={project_id}
        role={role}
        data={reports}           // ข้อมูล Array ของหน้านั้นๆ
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
      {logToDelete && (
        <GenericDeleteModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          
          // --- จุดที่ส่งข้อมูล ---
          entityType="Log"            
          entityName={logToDelete.file_name} 
          loading={isDeleting}
        />
      )}
    </div>
  );
}