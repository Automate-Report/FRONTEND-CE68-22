"use client";

import { use, useState } from "react";

import { Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useRouter } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { useWorker } from "@/src/hooks/worker/use-worker";
import { useWorkerDownload } from "@/src/hooks/worker/use-WorkerDownload";

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
    params: Promise<{ 
        id: string;
        workerId: string;
    }>
}

export default function WorkerDetailPage({ params }: PageProps)
{
    const router = useRouter();

    const resolvePrams = use(params);
    const projectId = parseInt(resolvePrams.id);
    const workerId = parseInt(resolvePrams.workerId);

    const { data: project, isLoading: isProjectLoading, isError: isProjectError} = useProject(projectId);
    const { data: worker, isLoading, isError, refetch } = useWorker(workerId);

    // download worker
    const { downloadWorker, isLoading: isDownloading } = useWorkerDownload();

    // ใช้ตอน delete worker 
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError || !worker) return <div className="p-8 text-red-500">Worker not found</div>;

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: project?.name || "Project Name" , href: `/projects/${projectId}/overview` },
        { label: "Worker Nodes", href: `/projects/${projectId}/workers` },
        { label: worker.name, href: undefined }
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
        <div className="bg-[#0F1518] text-[#E6F0E6]">
            <GenericBreadcrums items={breadcrumbItems}/>

            {/* ชื่อ + แก้ไข */}
            <div className="flex justify-between py-6 text-[32px] text-[#E6F0E6] font-bold">
                {worker.name}
                <div className="flex gap-6">
                    < GenericGreenButton
                        name="Edit"
                        href={`/workers/${worker.id}/edit`}
                        icon={<EditIcon />}
                    />
                    <button
                        type="button"
                        onClick={() => downloadWorker(worker.id, worker.name)}
                        disabled={isDownloading}
                        className={`
                            flex items-center justify-center gap-3
                            px-6 h-10
                            rounded-lg
                            text-[16px] font-semibold text-[#0B0F12] 
                            bg-[#8FFF9C] 
                            cursor-pointer
                            
                            /* Hover State */
                            hover:bg-[#AFFFB9]
                            
                            /* Disabled State */
                            disabled:opacity-70 
                            disabled:cursor-not-allowed 
                            disabled:bg-[#8FFF9C]
                        `}
                    >
                        {isDownloading ? (
                            /* สร้าง Loading Spinner ด้วย Tailwind */
                            <div className="w-5 h-5 border-2 border-[#0B0F12] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            /* Normal State */
                            <>
                                Download <DownloadIcon fontSize="small" />
                            </>
                        )}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => handleDeleteClick(worker)}
                        className="flex items-center justify-center bg-[#0B0F12] text-[#FE3B46] border border-[#FE3B46] text-[16px] font-semibold rounded-lg px-6 h-10 gap-3 cursor-pointer 
                                hover:bg-[#FE3B46] hover:text-[#FBFBFB]"
                    >
                        Delete
                        <DeleteIcon />
                    </button>
                </div>
                
            </div>

            <div className="w-fit mb-6">
                <div className="flex items-center gap-2">
                    <div className="flex justify-between text-[32px] text-[#E6F0E6] font-bold">Number of Threads</div>
                    <Tooltip 
                        title="Set the number of concurrent tasks this worker can process from the scheduled jobs."
                        placement="right"
                        arrow
                        sx={{
                            ".MuiTooltip-tooltip": {
                                backgroundColor: "#1A2023",
                                color: "#E6F0E6",
                                fontSize: "14px",
                                border: "1px solid #2A3033"
                            }
                        }}
                    >
                        <IconButton size="small" sx={{ color: "#8FFF9C", p: 0 }}>
                            <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className="mt-3  py-2 px-2 bg-[#FBFBFB] text-[#404F57] border rounded-lg">
                    {worker.thread_number}
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