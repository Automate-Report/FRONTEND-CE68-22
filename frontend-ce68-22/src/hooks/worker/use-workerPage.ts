import { useState } from "react";
import { workerService } from "@/src/services/worker.service";
import { Worker, CreateWorkerPayload} from "@/src/types/worker"

export const useWorkerPage = (refetchList: () => void) => {
    //  Create Logic
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    const handleCreateWorker = async (workername: string) => {
        setCreateLoading(true);
        try {
            const payload: CreateWorkerPayload = {
                name: workername
            }
            await workerService.create(payload);

            refetchList();
            setIsCreateModalOpen(false);
        }catch (error){
            console.error("Failed to create", error);
            alert("Failed to create worker");
        }
        setIsCreateModalOpen(false);
    };

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
        createState: { isOpen: isCreateModalOpen, setIsOpen: setIsCreateModalOpen, isLoading: createLoading, handleCreate: handleCreateWorker },
        deleteState: { isOpen: deleteModalOpen, setIsOpen: setDeleteModalOpen, isLoading: isDeleting, target: workerToDelete, handleDeleteClick, handleConfirmDelete }
    };
}