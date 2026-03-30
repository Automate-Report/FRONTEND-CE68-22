"use client";

import { use, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { LinkOff as UnlinkIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";

// Hooks
import { useProject } from "@/src/hooks/project/use-project";
import { useProjectRole } from "@/src/context/ProjectDetailConext";
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
import { YELLOW_BUTTON_STYLE, GREEN_BUTTON_STYLE, RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";

// Icons
import EditIcon from "@/src/components/icon/Edit";
import DownloadIcon from "@/src/components/icon/DownloadIcon";
import DeleteProjectIcon from "@/src/components/icon/Delete";

interface PageProps {
    params: Promise<{ id: string; workerId: string }>;
}

export default function WorkerDetailPage({ params }: PageProps) {
    const { role } = useProjectRole();
    const router = useRouter();
    const resolvePrams = use(params);
    const projectId = parseInt(resolvePrams.id);
    const workerId = parseInt(resolvePrams.workerId);

    useEffect(() => {
        if (role?.toLowerCase() === "developer") {
        router.replace(`/projects/${projectId}/overview`);
        }
    }, [role, projectId, router]);

    // --- Data Fetching ---
    const { data: project } = useProject(projectId);
    const { data: worker, refetch } = useWorker(workerId, projectId);
    const { data: summaryInfoJob } = useSummaryInfoByWorker(workerId, projectId);

    // --- Current User ---
    const [currentUserName, setCurrentUserName] = useState<string | undefined>(undefined);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                setCurrentUserName(res?.user?.name || res?.user?.username || res?.user);
            } catch (error) {
                // Handle error if needed
            }
        };
        fetchUser();
    }, []);

    const isProjectOwner = project?.role === "owner";
    const isPentester = project?.role === "pentester";
    const canUnlink = isProjectOwner || (worker?.owner !== null && worker?.owner === currentUserName);

    // --- Download Store ---
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
        projectId, workerId, jobQuery.page + 1, jobQuery.size, "created_at", "desc", jobQuery.search, jobQuery.filter
    );

    // --- Loading state ---
    if (!worker || !summaryInfoJob) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <CircularProgress size={36} sx={{ color: "#8FFF9C" }} />
                    <span className="text-[#4A6068] text-sm">Loading worker data...</span>
                </div>
            </div>
        );
    }

    // --- Handlers ---
    const handleConfirmUnlink = async () => {
        setIsActionLoading(true);
        try {
            await workerService.unLink(worker.id, projectId);
            setUnlinkModalOpen(false);
            await refetch();
            router.refresh();
            toast.success("Disconnected successfully");
        } catch {
            toast.error("Failed to disconnect");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        setIsActionLoading(true);
        try {
            await workerService.delete(worker.id, projectId);
            setDeleteModalOpen(false);
            router.push(`/projects/${projectId}/workers`);
            router.refresh();
            toast.success("Worker deleted");
        } catch {
            toast.error("Failed to delete");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDownloadAction = async () => {
        await startDownload(worker.id, projectId, worker.name, async () => {
            await refetch();
        });
    };

    const handleJobPageChange = (newPage: number, newSize: number) => {
        setJobQuery((prev) => ({ ...prev, page: newPage, size: newSize }));
    };


    return (
        <div>

            {/* Breadcrumbs */}
            <GenericBreadcrums
                items={[
                    { label: "Home", href: "/main" },
                    { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
                    { label: "Worker Nodes", href: `/projects/${projectId}/workers` },
                    { label: worker.name, href: undefined },
                ]}
            />

            {/* ── Header ── */}
            <div className="relative pt-2 mb-6">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

                    {/* Title block */}
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-[32px] font-bold text-[#E6F0E6] leading-tight tracking-tight">
                                {worker.name}
                            </h1>
                            <p className="text-base text-[#4A6068] mt-0.5">
                                Owner:{" "}
                                <span className={worker.owner ? "text-[#DD6E6E]" : "text-[#8FFF9C]"}>
                                    {worker.owner || "n/a"}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-6 flex-wrap">

                        {/* Edit */}
                        {(isProjectOwner || isPentester) && (
                            <GenericGreenButton
                                name="Edit"
                                href={`/projects/${projectId}/workers/${worker.id}/edit`}
                                icon={<EditIcon />}
                            />
                        )}

                        {/* Disconnect or Download */}
                        {worker.owner ? (
                            canUnlink && (
                                <button
                                    onClick={() => setUnlinkModalOpen(true)}
                                    disabled={isActionLoading}
                                    className={YELLOW_BUTTON_STYLE}
                                >
                                    {isActionLoading ? (
                                        <>
                                            <CircularProgress size={15} sx={{ color: "#FF9800" }} />
                                            <span>Disconnecting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <UnlinkIcon sx={{ fontSize: 17 }} />
                                            <span>Disconnect</span>
                                        </>
                                    )}
                                </button>
                            )
                        ) : (
                            (isProjectOwner || isPentester) && (
                                <button
                                    onClick={handleDownloadAction}
                                    disabled={globalIsLoading}
                                    className={GREEN_BUTTON_STYLE}
                                >
                                    {isThisWorkerDownloading ? (
                                        <>
                                            {globalProgress > 0 ? (
                                                <>
                                                    <span>{globalProgress}%</span>
                                                    <CircularProgress variant="determinate" value={globalProgress} size={15} sx={{ color: "#0B0F12" }} />
                                                </>
                                            ) : (
                                                <>
                                                    <span>Downloading...</span>
                                                    <CircularProgress size={15} sx={{ color: "#0B0F12" }} />
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <span>Download</span>
                                            <DownloadIcon />
                                        </>
                                    )}
                                </button>
                            )
                        )}

                        {/* Delete */}
                        {isProjectOwner && (
                            <button className={RED_BUTTON_STYLE}
                                onClick={() => setDeleteModalOpen(true)}>
                                Delete
                                <DeleteProjectIcon />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Content sections ── */}
            <WorkerSummaryStats summary={summaryInfoJob} worker={worker} />

            <WorkerConfigCard
                worker={worker}
                summaryInfoJob={summaryInfoJob}
                handleRevokeKey={async () => {
                    await workerService.reGenKey(worker.id, projectId);
                    refetch();
                }}
                role={project?.role}
            />

            <WorkerAssignedJobs
                jobs={jobs}
                isLoading={isJobsLoading}
                projectId={projectId}
                onPageChange={handleJobPageChange}
            />

            {/* ── Modals ── */}
            <WorkerUnlinkModal
                open={unlinkModalOpen}
                onClose={() => setUnlinkModalOpen(false)}
                onConfirm={handleConfirmUnlink}
                workerName={worker.name}
                loading={isActionLoading}
            />
            <GenericDeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                entityType="Worker"
                entityName={worker.name}
                loading={isActionLoading}
            />
        </div>
    );
}