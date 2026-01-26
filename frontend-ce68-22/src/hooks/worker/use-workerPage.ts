import { useState } from "react";
import { workerService } from "@/src/services/worker.service";
import { Worker, CreateWorkerPayload} from "@/src/types/worker"

export const useWorkerPage = (refetchList: () => void) => {

    //  Delete Logic
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (worker: Worker) => {
        setWorkerToDelete(worker);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!workerToDelete) return;
        setIsDeleting(true);
        try {
            await workerService.delete(workerToDelete.id);
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
        deleteState: { isOpen: deleteModalOpen, setIsOpen: setDeleteModalOpen, isLoading: isDeleting, target: workerToDelete, handleDeleteClick, handleConfirmDelete }
    };
}