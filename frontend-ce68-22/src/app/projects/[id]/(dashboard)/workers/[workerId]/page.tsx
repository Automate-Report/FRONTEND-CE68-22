"use client";

import { use, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Box, Typography, Stack, CircularProgress } from "@mui/material"; 
import { LinkOff as UnlinkIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";

// Hooks
import { useProject } from "@/src/hooks/project/use-project";
import { useSummaryInfoByWorker } from "@/src/hooks/job/use-summaryInfoByWorker";
import { useGetJobByWorker } from "@/src/hooks/job/use-getJobByWorker";
import { useWorker } from "@/src/hooks/worker/use-worker";

// ✅ Global Download Store & Services
import { useDownloadStore } from "@/src/hooks/worker/use-WorkerDownloadStore";
import { workerService } from "@/src/services/worker.service";
import { getMe } from "@/src/services/auth.service";

// Components
import { WorkerAssignedJobs } from "@/src/components/workers/WorkerAssignedJobs";
import { WorkerSummaryStats } from "@/src/components/workers/WorkerSummaryStats";
import { WorkerConfigCard } from "@/src/components/workers/WorkerConfigCard";
import { WorkerUnlinkModal } from "@/src/components/workers/WorkerUnLinkModal";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";

// Icons
import EditIcon from "@/src/components/icon/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

interface PageProps { params: Promise<{ id: string; workerId: string; }> }

export default function WorkerDetailPage({ params }: PageProps) {
    const router = useRouter();
    const resolvePrams = use(params);
    const projectId = parseInt(resolvePrams.id);
    const workerId = parseInt(resolvePrams.workerId);

    // --- Data Fetching ---
    const { data: project } = useProject(projectId);
    const { data: worker, refetch } = useWorker(workerId);
    const { data: summaryInfoJob } = useSummaryInfoByWorker(workerId);
    
    // --- ✅ Current User & Permission Logic ---
    const [currentUserName, setCurrentUserName] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                // ✅ เก็บชื่อ/username เพื่อเทียบกับ worker.owner (คนที่ Connect worker ตัวนี้อยู่)
                setCurrentUserName(res?.user?.name || res?.user?.username || res?.user);
            } catch (error) { console.error("Fetch user failed", error); }
        };
        fetchUser();
    }, []);

    const isProjectOwner = project?.role === "owner";
    const isPentester = project?.role === "pentester";
    
    // ✅ เงื่อนไข Unlink: เป็นเจ้าของโปรเจกต์ หรือ เป็นคนเดียวกับที่ Connect worker ตัวนี้อยู่
    const canUnlink = isProjectOwner || (worker?.owner !== null && worker?.owner === currentUserName);

    // --- ✅ Global Download State ---
    const startDownload = useDownloadStore((state) => state.startDownload);
    const globalIsLoading = useDownloadStore((state) => state.isDownloading);
    const globalProgress = useDownloadStore((state) => state.progress);
    const currentDownloadingId = useDownloadStore((state) => state.currentWorkerId);

    const isThisWorkerDownloading = globalIsLoading && currentDownloadingId === workerId;

    // --- Local States ---
    const [jobQuery, setJobQuery] = useState({ page: 0, size: 5, search: "", filter: "ALL" });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [unlinkModalOpen, setUnlinkModalOpen] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const { data: jobs, isLoading: isJobsLoading } = useGetJobByWorker(
        workerId, jobQuery.page + 1, jobQuery.size, "created_at", "desc", jobQuery.search, jobQuery.filter
    );

    if (!worker || !summaryInfoJob) return <Box sx={{ p: 8, color: '#E6F0E6' }}>Loading data...</Box>;

    // --- Handlers ---

    const handleConfirmUnlink = async () => {
        setIsActionLoading(true);
        try {
            await workerService.unLink(worker.id, projectId);
            setUnlinkModalOpen(false);
            await refetch();
            router.refresh();
            toast.success("Disconnected successfully");
        } catch (error) { toast.error("Failed to disconnect"); } 
        finally { setIsActionLoading(false); }
    };

    const handleConfirmDelete = async () => {
        setIsActionLoading(true);
        try {
            await workerService.delete(worker.id, projectId);
            setDeleteModalOpen(false);
            router.push(`/projects/${projectId}/workers`);
            router.refresh();
            toast.success("Worker deleted");
        } catch (error) { toast.error("Failed to delete"); } 
        finally { setIsActionLoading(false); }
    };

    const handleDownloadAction = async () => {
        await startDownload(worker.id, projectId, worker.name, async () => {
            await refetch();
        });
    };

    const handleJobPageChange = (newPage: number, newSize: number) => {
        setJobQuery(prev => ({ ...prev, page: newPage, size: newSize }));
    };

    return (
        <Box sx={{ pb: 10 }}>
            <GenericBreadcrums items={[
                { label: "Home", href: "/main" }, 
                { label: project?.name || "Project", href: `/projects/${projectId}/overview` }, 
                { label: "Worker Nodes", href: `/projects/${projectId}/workers` }, 
                { label: worker.name, href: undefined }
            ]} />
            
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 4 }}>
                <div>
                    <Typography variant="h3" sx={{ color: "#E6F0E6", fontWeight: "bold" }}>{worker.name}</Typography>
                    <Typography variant="h4" sx={{ color: "#9AA6A8", fontWeight: "bold" }}>Owner: {worker.owner || "n/a"}</Typography>
                </div>
                
                <Stack direction="row" spacing={2}>
                    {/* ✅ ปุ่ม Edit: แสดงผลให้ทั้ง Project Owner และ Pentester */}
                    {(isProjectOwner || isPentester) && (
                        <GenericGreenButton name="Edit" href={`/projects/${projectId}/workers/${worker.id}/edit`} icon={<EditIcon />} />
                    )}
                    
                    {worker.owner ? (
                        /* ✅ แสดงปุ่ม Disconnect เฉพาะผู้ที่มีสิทธิ์ (Admin หรือ คนที่ถือครอง worker นี้) */
                        canUnlink && (
                            <button 
                                onClick={() => setUnlinkModalOpen(true)} 
                                disabled={isActionLoading}
                                className="flex items-center gap-3 px-6 h-10 rounded-lg font-semibold bg-[#0B0F12] text-[#FF9800] border border-[#FF9800] hover:bg-[#FF9800] hover:text-[#0B0F12]"
                            >
                                {isActionLoading ? "Disconnecting..." : "Disconnect"} 
                                {isActionLoading ? <CircularProgress size={18} sx={{ color: "#FF9800" }} /> : <UnlinkIcon fontSize="small" />}
                            </button>
                        )
                    ) : (
                        /* ✅ ปุ่ม Download: สิทธิ์ Pentester/Owner สามารถโหลดได้ถ้ายังไม่มีใครถือครอง */
                        (isProjectOwner || isPentester) && (
                            <button 
                                onClick={handleDownloadAction}
                                disabled={globalIsLoading} 
                                className="flex items-center gap-3 px-6 h-10 rounded-lg font-semibold bg-[#8FFF9C] text-[#0B0F12] hover:bg-[#AFFFB9] disabled:opacity-70"
                            >
                                {isThisWorkerDownloading ? (
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        {globalProgress > 0 ? (
                                            <>
                                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{globalProgress}%</Typography>
                                                <CircularProgress variant="determinate" value={globalProgress} size={18} sx={{ color: "#0B0F12" }} />
                                            </>
                                        ) : (
                                            <>
                                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Downloading...</Typography>
                                                <CircularProgress size={18} sx={{ color: "#0B0F12" }} />
                                            </>
                                        )}
                                    </Stack>
                                ) : (
                                    <>Download <DownloadIcon /></>
                                )}
                            </button>
                        )
                    )}

                    {/* ✅ ปุ่ม Delete: แสดงผลเฉพาะ Project Owner เท่านั้น (Pentester ลบไม่ได้) */}
                    {isProjectOwner && (
                        <button 
                            onClick={() => setDeleteModalOpen(true)} 
                            className="flex items-center gap-3 bg-[#0B0F12] text-[#FE3B46] border border-[#FE3B46] font-semibold rounded-lg px-6 h-10 hover:bg-[#FE3B46] hover:text-[#FBFBFB]"
                        >
                            Delete <DeleteIcon fontSize="small" />
                        </button>
                    )}
                </Stack>
            </Stack>

            <WorkerSummaryStats summary={summaryInfoJob} worker={worker} />
            <WorkerConfigCard 
                worker={worker} 
                summaryInfoJob={summaryInfoJob} 
                handleRevokeKey={async () => { await workerService.reGenKey(worker.id, projectId); refetch(); }} 
                role={project?.role}
            />
            
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