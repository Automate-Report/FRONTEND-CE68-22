import { useState } from "react";
import { workerService } from "@/src/services/worker.service";
import { Worker } from "@/src/types/worker"

// @/src/hooks/worker/use-workerPage.ts

export const useWorkerPage = (projectId: number, refetchList: () => void) => { // 💡 เพิ่ม projectId ตรงนี้
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (worker: Worker) => {
        setWorkerToDelete(worker);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!workerToDelete || !projectId) return; // 💡 เช็คทั้งคู่
        setIsDeleting(true);
        try {
            // 💡 ใช้ projectId ที่รับมาจาก Hook แทนการดึงจากตัว worker
            await workerService.delete(workerToDelete.id, projectId); 
            setDeleteModalOpen(false);
            setWorkerToDelete(null);
            refetchList();
        } catch (error) {
            alert("Failed to delete");
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        deleteState: { 
            isOpen: deleteModalOpen, 
            setIsOpen: setDeleteModalOpen, 
            isLoading: isDeleting, 
            target: workerToDelete, 
            handleDeleteClick, 
            handleConfirmDelete 
        }
    };
}