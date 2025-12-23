"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useWorker } from "@/src/hooks/use-worker";
import { workerService } from "@/src/services/worker.service";
import { Worker } from "@/src/types/worker";

import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { AccessKeyBoxSection } from "@/src/components/workers/AccessKeyBoxSection";

import EditIcon from "@/src/components/icon/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

interface PageProps{
    params: Promise<{ id: string}>
}

export default function WorkerDetailPage({ params }: PageProps)
{
    const router = useRouter();

    const resolvePrams = use(params);
    const workerId = parseInt(resolvePrams.id);
    const { data: worker, isLoading, isError, refetch } = useWorker(workerId);

    // ใช้ตอน delete worker 
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError || !worker) return <div className="p-8 text-red-500">Worker not found</div>;

    const breadcrumbItems = [
        { label: "Worker", href: "/workers"},
        { label: worker.name , href: undefined}
    ];

    // --- Function Delete ---
    const handleDeleteClick = (targetWorker: Worker) => {
        setWorkerToDelete(targetWorker);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!workerToDelete) return;

        setIsDeleting(true);
        try {
            await workerService.delete(workerToDelete.id); // ใช้ id จาก state เพื่อความชัวร์

            // ลบสำเร็จ -> ปิด Modal
            setDeleteModalOpen(false);
            setWorkerToDelete(null);

            // 3. ย้ายกลับไปหน้า list แทนการ refetch
            router.push('/workers'); 
            router.refresh(); // บังคับให้หน้า list โหลดข้อมูลใหม่

        } catch (error) {
            console.error("Failed to delete", error);
            alert("Failed to delete worker"); 
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="px-12 py-6 bg-[#0F1518] text-[#E6F0E6]">
            <GenericBreadcrums items={breadcrumbItems}/>

            {/* ชื่อ + แก้ไข */}
            <div className="flex justify-between py-6 text-[32px] text-[#E6F0E6] font-bold">
                {worker.name}
                <div className="flex gap-6">
                    < GenericGreenButton
                        name="Edit"
                        href="/workers"
                        icon={<EditIcon />}
                    />
                    < GenericGreenButton
                        name="Download"
                        href="/workers"
                        icon={<DownloadIcon />}
                    />
                    
                    <button 
                        type="button"
                        onClick={() => handleDeleteClick(worker)}
                        className="flex items-center justify-center bg-[#0B0F12] text-[#FE3B46] border border-[#FE3B46] text-[16px] font-semibold rounded-lg shadow-sm px-6 py-3 gap-3 cursor-pointer hover:bg-[#FE3B46] hover:text-[#FBFBFB]"
                    >
                        Delete
                        <DeleteIcon />
                    </button>
                </div>
                
            </div>

            {/* Access Key */}
            <div className="flex flex-col justify-between  text-[32px] text-[#E6F0E6] font-bold" >
                Access Key
                <AccessKeyBoxSection 
                    worker={worker} 
                    onRefresh={refetch}
                />
            </div>

            {/* Job Assigned */}
            <div className="flex justify-between py-6 text-[32px] text-[#E6F0E6] font-bold" >
                Job Assigned
            </div>

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