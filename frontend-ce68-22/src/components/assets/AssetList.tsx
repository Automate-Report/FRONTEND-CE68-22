"use client";

import { useState, useEffect } from "react";
import { useAssets } from "@/src/hooks/asset/use-assets";
import { AssetTable } from "./AssetTable";
import { useTable } from "@/src/hooks/use-table";
import { Asset } from "@/src/types/asset";
import { GenericDeleteModal } from "../Common/GenericDeleteModal";
import { assetService } from "@/src/services/asset.service";

//นิยาม Interface สำหรับ Props
interface AssetListProps {
  searchQuery: string;
  filterStatus: string;
  project_id: number;
}


export function AssetList({ searchQuery, filterStatus, project_id }: AssetListProps) {

  const {
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSort,
  } = useTable<Asset>();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  //(สำคัญ) เมื่อ Search หรือ Filter เปลี่ยน ควร reset page กลับไปหน้าแรก
  useEffect(() => {
     handleChangePage(null, 0); 
     // หมายเหตุ: ต้องเช็คว่า handleChangePage ของคุณรองรับ event null หรือไม่ 
     // ถ้าไม่รองรับ อาจต้องใช้ setPage(0) ตรงๆ (ถ้า useTable expose ออกมา)
  }, [searchQuery, filterStatus]);

  const { data: response, isLoading, isError, refetch } = useAssets(
    project_id,
    page + 1, 
    rowsPerPage, 
    sortBy, 
    sortOrder, 
    searchQuery,
    filterStatus
  );


  const handleDeleteClick = (asset: Asset) => {
    setAssetToDelete(asset);
    setDeleteModalOpen(true);
  };

  // 2. เมื่อกดยืนยันใน Modal
  const handleConfirmDelete = async () => {
    if (!assetToDelete) return;
    
    setIsDeleting(true);
    try {
      await assetService.delete(assetToDelete.id);
      
      // ลบสำเร็จ -> ปิด Modal -> โหลดตารางใหม่
      setDeleteModalOpen(false);
      setAssetToDelete(null);
      refetch(); // *สำคัญ* ดึงข้อมูลใหม่
      
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete asset"); // หรือใช้ Snackbar/Toast
    } finally {
      setIsDeleting(false);
    }
  };



  // ดึง items และ total จาก response (Handle กรณี response เป็น undefined)
  const assets = response?.items || [];
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
     return <div className="text-center py-10">ไม่พบ Asset</div>;
  }

  return (
    <div>
      <AssetTable 
        data={assets}           // ข้อมูล Array ของหน้านั้นๆ
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
      {assetToDelete && (
        <GenericDeleteModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          
          // --- จุดที่ส่งข้อมูล ---
          entityType="Asset"            
          entityName={assetToDelete.name} 
          loading={isDeleting}
        />
      )}
    </div>
  );
}