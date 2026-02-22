"use client";

import { use, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { LinkOff as UnlinkIcon } from "@mui/icons-material";

import { useRouter } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { useSummaryInfoByWorker } from "@/src/hooks/job/use-summaryInfoByWorker";
import { useGetJobByWorker } from "@/src/hooks/job/use-getJobByWorker";
import { useWorker } from "@/src/hooks/worker/use-worker";
import { useWorkerDownload } from "@/src/hooks/worker/use-WorkerDownload";
import { workerService } from "@/src/services/worker.service";
import { Worker } from "@/src/types/worker";
import { WorkerAssignedJobs } from "@/src/components/workers/WorkerAssignedJobs";
import { WorkerSummaryStats } from "@/src/components/workers/WorkerSummaryStats";
import { WorkerConfigCard } from "@/src/components/workers/WorkerConfigCard";

import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";

import EditIcon from "@/src/components/icon/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

interface PageProps {
    params: Promise<{ id: string; workerId: string; }>
}

export default function WorkerDetailPage({ params }: PageProps) {
    const router = useRouter();
    const resolvePrams = use(params);
    const projectId = parseInt(resolvePrams.id);
    const workerId = parseInt(resolvePrams.workerId);

    const { data: project } = useProject(projectId);
    const { data: worker, isLoading: isWorkerLoading, refetch } = useWorker(workerId);
    const { data: summaryInfoJob, isLoading: isSummaryLoading } = useSummaryInfoByWorker(workerId);

    // แก้ไข: ส่งค่า page และ size เข้าไปเพื่อให้ Pagination ทำงาน
    const [jobQuery, setJobQuery] = useState({ page: 0, size: 5 });
    const { data: jobs, isLoading: isJobsLoading } = useGetJobByWorker(workerId, jobQuery.page, jobQuery.size);
    
    const { downloadWorker, isLoading: isDownloading } = useWorkerDownload();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionType, setActionType] = useState<"delete" | "unlink">("delete");

    if (isWorkerLoading || isSummaryLoading || isJobsLoading) {
        return <Box sx={{ p: 8, color: '#E6F0E6' }}>Loading data...</Box>;
    }

    if (!worker || !summaryInfoJob) {
        return <Box sx={{ p: 8, color: '#FE3B46' }}>Worker or Summary data not found</Box>;
    }

    const breadcrumbItems = [
        { label: "Home", href: "/main" },
        { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
        { label: "Worker Nodes", href: `/projects/${projectId}/workers` },
        { label: worker.name, href: undefined }
    ];

    // ฟังก์ชันเปิด Modal สำหรับทั้ง Unlink และ Delete
    const handleActionClick = (targetWorker: Worker, type: "delete" | "unlink") => {
        setWorkerToDelete(targetWorker);
        setActionType(type);
        setDeleteModalOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!workerToDelete) return;
        setIsDeleting(true);
        try {
            if (actionType === "unlink") {
                await workerService.unLink(workerToDelete.id);
            } else {
                await workerService.delete(workerToDelete.id);
            }
            
            setDeleteModalOpen(false);
            // หลังจากทำรายการสำเร็จ ให้กลับไปหน้าลิสต์หรือ Refresh ข้อมูล
            router.push(`/projects/${projectId}/workers`);
            router.refresh();
        } catch (error) {
            alert(`Failed to ${actionType} worker`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRevokeKey = async () => {
        try {
            await workerService.reGenKey(worker.id);
            refetch();
        } catch (error) {
            alert("Failed to re-create access key");
        }
    };

    const handleJobPageChange = (newPage: number, newSize: number) => {
        setJobQuery({ page: newPage, size: newSize });
    };

    return (
        <Box sx={{ pb: 10 }}>
            <GenericBreadcrums items={breadcrumbItems} />

            {/* Header Area */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 4 }}>
                <Typography variant="h3" sx={{ color: "#E6F0E6", fontWeight: "bold" }}>
                    {worker.name}
                </Typography>
                
                <Stack direction="row" spacing={2}>
                    <GenericGreenButton
                        name="Edit"
                        href={`/projects/${projectId}/workers/${worker.id}/edit`}
                        icon={<EditIcon />}
                    />
                    
                    {worker.isActive ? (
                        <button
                            type="button"
                            onClick={() => handleActionClick(worker, "unlink")}
                            className="flex items-center gap-3 px-6 h-10 rounded-lg text-[16px] font-semibold transition-all bg-[#0B0F12] text-[#FE3B46] border border-[#FE3B46] hover:bg-[#FE3B46] hover:text-[#FBFBFB]"
                        >
                            Unlink <UnlinkIcon fontSize="small" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => downloadWorker(worker.id, worker.name)}
                            disabled={isDownloading}
                            className="flex items-center gap-3 px-6 h-10 rounded-lg text-[16px] font-semibold transition-all bg-[#8FFF9C] text-[#0B0F12] hover:bg-[#AFFFB9]"
                        >
                            {isDownloading ? <div className="w-5 h-5 border-2 border-[#0B0F12] border-t-transparent rounded-full animate-spin" /> : <>Download <DownloadIcon fontSize="small" /></>}
                        </button>
                    )}

                    <button 
                        onClick={() => handleActionClick(worker, "delete")}
                        className="flex items-center gap-3 bg-[#0B0F12] text-[#FE3B46] border border-[#FE3B46] text-[16px] font-semibold rounded-lg px-6 h-10 hover:bg-[#FE3B46] hover:text-[#FBFBFB] transition-all"
                    >
                        Delete <DeleteIcon fontSize="small" />
                    </button>
                </Stack>
            </Stack>

            {/* Section: Job Summary Stats */}
            <WorkerSummaryStats 
                summary={summaryInfoJob} 
                worker={worker} 
            />

            {/* Section: Worker Configuration */}
            <WorkerConfigCard 
                worker={worker} 
                summaryInfoJob={summaryInfoJob} 
                handleRevokeKey={handleRevokeKey} 
            />

            {/* Section: Assigned Jobs */}
            <WorkerAssignedJobs 
                jobs={jobs} 
                isLoading={isJobsLoading} 
                projectId={projectId} 
                onPageChange={handleJobPageChange}
            />

            {/* Modal ยืนยันการลบ หรือ Unlink */}
            {workerToDelete && (
                <GenericDeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleConfirmAction}
                    entityType={actionType === "unlink" ? "Unlink Worker" : "Worker"}
                    entityName={workerToDelete.name}
                    loading={isDeleting}
                />
            )}
        </Box>
    );
}