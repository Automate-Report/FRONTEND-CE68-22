"use client";

import { use, useState } from "react";
import toast from "react-hot-toast";
// ✅ เพิ่ม CircularProgress เข้ามา
import { Box, Typography, Stack, CircularProgress } from "@mui/material"; 
import { LinkOff as UnlinkIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { useSummaryInfoByWorker } from "@/src/hooks/job/use-summaryInfoByWorker";
import { useGetJobByWorker } from "@/src/hooks/job/use-getJobByWorker";
import { useWorker } from "@/src/hooks/worker/use-worker";
import { useWorkerDownload } from "@/src/hooks/worker/use-WorkerDownload";
import { workerService } from "@/src/services/worker.service";

import { WorkerAssignedJobs } from "@/src/components/workers/WorkerAssignedJobs";
import { WorkerSummaryStats } from "@/src/components/workers/WorkerSummaryStats";
import { WorkerConfigCard } from "@/src/components/workers/WorkerConfigCard";
import { WorkerUnlinkModal } from "@/src/components/workers/WorkerUnLinkModal";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";

import EditIcon from "@/src/components/icon/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

interface PageProps { params: Promise<{ id: string; workerId: string; }> }

export default function WorkerDetailPage({ params }: PageProps) {
    const router = useRouter();
    const resolvePrams = use(params);
    const projectId = parseInt(resolvePrams.id);
    const workerId = parseInt(resolvePrams.workerId);

    const { data: project } = useProject(projectId);
    const { data: worker, refetch } = useWorker(workerId);
    const { data: summaryInfoJob } = useSummaryInfoByWorker(workerId);
    const [jobQuery, setJobQuery] = useState({ 
        page: 0, 
        size: 5,
        search: "",
        filter: "ALL"
    });
    
    const { data: jobs, isLoading: isJobsLoading } = useGetJobByWorker(
        workerId, 
        jobQuery.page + 1, 
        jobQuery.size,
        "created_at",
        "desc",
        jobQuery.search,
        jobQuery.filter
    );

    // ✅ เรียกใช้ Hook ดาวน์โหลด
    const { downloadWorker, isLoading: isDownloading } = useWorkerDownload();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [unlinkModalOpen, setUnlinkModalOpen] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    if (!worker || !summaryInfoJob) return <Box sx={{ p: 8, color: '#E6F0E6' }}>Loading data...</Box>;

    const handleConfirmUnlink = async () => {
        setIsActionLoading(true);
        try {
            await workerService.unLink(worker.id);
            setUnlinkModalOpen(false);
            await refetch();
            router.refresh();
        } catch (error) { alert("Failed to disconnect"); } finally { setIsActionLoading(false); }
    };

    const handleConfirmDelete = async () => {
        setIsActionLoading(true);
        try {
            await workerService.delete(worker.id);
            setDeleteModalOpen(false);
            router.push(`/projects/${projectId}/workers`);
            router.refresh();
        } catch (error) { alert("Failed to delete"); } finally { setIsActionLoading(false); }
    };

    const handleJobPageChange = (newPage: number, newSize: number) => {
        setJobQuery(prev => ({ 
            ...prev, 
            page: newPage, 
            size: newSize 
        }));
    };

    const handleDownloadAndRefetch = async () => {
        try {
            await downloadWorker(worker.id, worker.name);
            // ✅ เมื่อดาวน์โหลดสำเร็จ (หรือเริ่มดาวน์โหลดในฝั่ง Browser) ให้ดึงข้อมูลใหม่
            await refetch(); 
            toast.success("ดึงข้อมูลล่าสุดเรียบร้อย");
        } catch (error) {
            console.error("Download or refetch failed:", error);
        }
    };

    return (
        <Box sx={{ pb: 10 }}>
            <GenericBreadcrums items={[{ label: "Home", href: "/main" }, { label: project?.name || "Project", href: `/projects/${projectId}/overview` }, { label: "Worker Nodes", href: `/projects/${projectId}/workers` }, { label: worker.name, href: undefined }]} />
            
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 4 }}>
                <div>
                    <Typography variant="h3" sx={{ color: "#E6F0E6", fontWeight: "bold" }}>{worker.name}</Typography>
                    <Typography variant="h4" sx={{ color: "#E6F0E6", fontWeight: "bold" }}>Owner: {worker.owner || "n/a"}</Typography>
                </div>
                
                <Stack direction="row" spacing={2}>
                    <GenericGreenButton name="Edit" href={`/projects/${projectId}/workers/${worker.id}/edit`} icon={<EditIcon />} />
                    
                    {worker.owner ? (
                        <button 
                            onClick={() => setUnlinkModalOpen(true)} 
                            disabled={isActionLoading}
                            className="flex items-center gap-3 px-6 h-10 rounded-lg font-semibold bg-[#0B0F12] text-[#FF9800] border border-[#FF9800] hover:bg-[#FF9800] hover:text-[#0B0F12]"
                        >
                            {isActionLoading ? "Disconnecting..." : "Disconnect"} 
                            {isActionLoading ? <CircularProgress size={18} sx={{ color: "#FF9800" }} /> : <UnlinkIcon fontSize="small" />}
                        </button>
                    ) : (
                        <button 
                            onClick={handleDownloadAndRefetch}
                            disabled={isDownloading} 
                            className="flex items-center gap-3 px-6 h-10 rounded-lg font-semibold bg-[#8FFF9C] text-[#0B0F12] hover:bg-[#AFFFB9] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {/* ✅ เปลี่ยนเป็น Spinner เมื่อกำลังโหลด */}
                            {isDownloading ? (
                                <>
                                    Downloading...
                                    <CircularProgress size={18} sx={{ color: "#0B0F12" }} />
                                </>
                            ) : (
                                <>
                                    Download <DownloadIcon fontSize="small" />
                                </>
                            )}
                        </button>
                    )}

                    <button 
                        onClick={() => setDeleteModalOpen(true)} 
                        className="flex items-center gap-3 bg-[#0B0F12] text-[#FE3B46] border border-[#FE3B46] font-semibold rounded-lg px-6 h-10 hover:bg-[#FE3B46] hover:text-[#FBFBFB]"
                    >
                        Delete <DeleteIcon fontSize="small" />
                    </button>
                </Stack>
            </Stack>

            <WorkerSummaryStats summary={summaryInfoJob} worker={worker} />
            <WorkerConfigCard worker={worker} summaryInfoJob={summaryInfoJob} handleRevokeKey={async () => { await workerService.reGenKey(worker.id); refetch(); }} />
            <WorkerAssignedJobs 
                jobs={jobs} 
                isLoading={isJobsLoading} 
                projectId={projectId} 
                onPageChange={handleJobPageChange}
            />
            
            <WorkerUnlinkModal open={unlinkModalOpen} onClose={() => setUnlinkModalOpen(false)} onConfirm={handleConfirmUnlink} workerName={worker.name} loading={isActionLoading} />
            <GenericDeleteModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleConfirmDelete} entityType="Worker" entityName={worker.name} loading={isActionLoading} />
        </Box>
    );
}