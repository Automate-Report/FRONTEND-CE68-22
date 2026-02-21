"use client";

import { use, useState } from "react";
import { Tooltip, IconButton, Box, Typography, Stack } from "@mui/material";
import { 
  Assignment as TotalJobIcon, 
  CheckCircle as CompletedIcon, 
  Error as FailedIcon, 
  BugReport as FindingIcon,
  SettingsInputComponent as ConfigIcon,
  FiberManualRecord as StatusIcon,
  Visibility as EyeOpenIcon, 
  VisibilityOff as EyeClosedIcon,
  Wifi as IpIcon, 
  Dns as HostIcon, 
  Favorite as HeartbeatIcon,
  EventNote as CalendarIcon,
  CheckCircle as SuccessIcon,
  Person as WorkerNameIcon,
  Memory as ThreadIcon, 
  Speed as PerformanceIcon,
  ContentCopy as CopyIcon,
  LinkOff as UnlinkIcon // เพิ่มไอคอน Unlink
} from "@mui/icons-material";

import { useRouter } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { useSummaryInfoByWorker } from "@/src/hooks/job/use-summaryInfoByWorker";
import { useWorker } from "@/src/hooks/worker/use-worker";
import { useWorkerDownload } from "@/src/hooks/worker/use-WorkerDownload";
import { workerService } from "@/src/services/worker.service";
import { Worker } from "@/src/types/worker";

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
    const { data: worker, isLoading: isWorkerLoading } = useWorker(workerId);
    const { data: summaryInfoJob, isLoading: isSummaryLoading } = useSummaryInfoByWorker(workerId);

    console.log(summaryInfoJob)
    
    const { downloadWorker, isLoading: isDownloading } = useWorkerDownload();

    const [showKey, setShowKey] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    // เพิ่ม state เพื่อแยกระหว่างการลบและการ Unlink ใน Modal
    const [actionType, setActionType] = useState<"delete" | "unlink">("delete");

    if (isWorkerLoading || isSummaryLoading) {
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

    const handleDeleteClick = (targetWorker: Worker, type: "delete" | "unlink" = "delete") => {
        setWorkerToDelete(targetWorker);
        setActionType(type);
        setDeleteModalOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!workerToDelete) return;
        setIsDeleting(true);
        try {
            // ในที่นี้สมมติว่าใช้ service ตัวเดียวกัน แต่ถ้ามี unlink service แยกก็สามารถเรียกตรงนี้ได้
            await workerService.delete(workerToDelete.id); 
            setDeleteModalOpen(false);
            router.push(`/projects/${projectId}/workers`);
            router.refresh();
        } catch (error) {
            alert(`Failed to ${actionType} worker`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Box sx={{ pb: 10}}>
            <GenericBreadcrums items={breadcrumbItems} />

            {/* Header Area */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pb: 4 }}>
                <Typography variant="h3" sx={{ color: "#E6F0E6", fontWeight: "bold" }}>
                    {worker.name}
                </Typography>
                
                <Stack direction="row" spacing={2}>
                    <GenericGreenButton
                        name="Edit"
                        href={`/projects/${projectId}/workers/${worker.id}/edit`}
                        icon={<EditIcon />}
                    />
                    
                    {/* สลับปุ่ม Download เป็น Unlink ถ้า isActive = True */}
                    {worker.isActive ? (
                        <button
                            type="button"
                            onClick={() => handleDeleteClick(worker, "unlink")}
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

                    {/* ปุ่ม Delete มีไว้เสมอตามความต้องการ */}
                    <button 
                        onClick={() => handleDeleteClick(worker, "delete")}
                        className="flex items-center gap-3 bg-[#0B0F12] text-[#FE3B46] border border-[#FE3B46] text-[16px] font-semibold rounded-lg px-6 h-10 hover:bg-[#FE3B46] hover:text-[#FBFBFB] transition-all"
                    >
                        Delete <DeleteIcon fontSize="small" />
                    </button>
                </Stack>
            </Stack>

            {/* Section: Job Summary Stats (5 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                {[
                    { label: "Total Jobs", value: summaryInfoJob?.total_jobs , color: "#FBFBFB", icon: <TotalJobIcon /> },
                    { label: "Completed", value: summaryInfoJob?.total_completed , color: "#8FFF9C", icon: <CompletedIcon /> },
                    { label: "Failed", value: summaryInfoJob?.total_failed , color: "#FE3B46", icon: <FailedIcon /> },
                    { label: "Total Findings", value: summaryInfoJob?.total_findings , color: "#FFCC00", icon: <FindingIcon /> },
                    { label: "Current Load", value: `${worker.current_load}/${worker.thread_number}`, color: "#3B9FFE", icon: <PerformanceIcon /> },
                ].map((item, i) => (
                    <Box key={i} sx={{ 
                        bgcolor: "#1E2429", p: 2.5, borderRadius: "16px", border: "1px solid #404F57", 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: '0.2s', '&:hover': { transform: 'translateY(-4px)', borderColor: item.color }
                    }}>
                        <Box>
                            <Typography variant="h4" sx={{ color: item.color, fontWeight: 900 }}>{item.value}</Typography>
                            <Typography sx={{ color: "#9AA6A8", fontSize: "11px", fontWeight: 800, textTransform: 'uppercase' }}>{item.label}</Typography>
                        </Box>
                        <Box sx={{ width: 44, height: 44, borderRadius: "12px", display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, bgcolor: `${item.color}10` }}>{item.icon}</Box>
                    </Box>
                ))}
            </div>

            {/* Section: Worker Configuration Card */}
            <Box sx={{ bgcolor: "#1E2429", borderRadius: "20px", border: "1px solid #404F57", overflow: "hidden", mb: 6 }}>
                <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #404F57", display: "flex", alignItems: "center", gap: 1.5, bgcolor: "rgba(255, 255, 255, 0.02)" }}>
                    <ConfigIcon sx={{ color: "#8FFF9C", fontSize: 20 }} />
                    <Typography sx={{ color: "#E6F0E6", fontWeight: "bold" }}>Worker Configuration</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        {[
                            { label: "Worker Name", value: worker.name, icon: <WorkerNameIcon sx={{ fontSize: 18 }} />, color: "#FBFBFB" },
                            { label: "Status", value: worker.status?.toUpperCase() ?? "unknown", icon: <StatusIcon sx={{ fontSize: 10 }} />, color: worker.status === 'online' ? "#8FFF9C" : "#FE3B46", isStatus: true },
                            { label: "Hostname", value: worker.hostname || "n/a", icon: <HostIcon sx={{ fontSize: 18 }} />, color: "#FBFBFB", isMono: true },
                            { label: "Internal IP (Hostname IP)", value: worker.internal_ip || "0.0.0.0", icon: <IpIcon sx={{ fontSize: 18 }} />, color: "#FBFBFB", isMono: true },
                            { label: "Max Threads", value: `${worker.thread_number} Threads`, icon: <ThreadIcon sx={{ fontSize: 18 }} />, color: "#FBFBFB" },
                            { label: "Created Date", value: worker.created_at || "-", icon: <CalendarIcon sx={{ fontSize: 18 }} />, color: "#FBFBFB" },
                            { label: "Last Heartbeat", value: worker.last_heartbeat || "Never", icon: <HeartbeatIcon sx={{ fontSize: 18 }} />, color: worker.status === 'online' ? "#8FFF9C" : "#9AA6A8" },
                            { label: "Jobs Completed", value: summaryInfoJob?.total_completed ?? 0, icon: <SuccessIcon sx={{ fontSize: 18 }} />, color: "#8FFF9C", isBold: true },
                        ].map((item, index) => (
                            <Box key={index} sx={{ gridColumn: item.span ? `span ${item.span}` : 'span 1' }}>
                                <Typography sx={{ color: "#9AA6A8", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", mb: 1, ml: 0.5 }}>{item.label}</Typography>
                                <Box sx={{ bgcolor: "#0F1518", px: 2, py: 1.5, borderRadius: "12px", border: "1px solid #2D2F39", display: 'flex', alignItems: 'center', minHeight: "48px" }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                                        <Box sx={{ color: item.color, display: 'flex', opacity: 0.9, ...(item.isStatus && { p: 0.5, bgcolor: `${item.color}15`, borderRadius: "50%" }) }}>{item.icon}</Box>
                                        <Typography sx={{ color: item.color, fontSize: item.isBold ? "18px" : "15px", fontWeight: "bold", fontFamily: item.isMono ? "monospace" : "inherit" }}>{item.value}</Typography>
                                    </Stack>
                                </Box>
                            </Box>
                        ))}
                    </div>

                    {/* Access Key Area */}
                    <Box sx={{ mt: 5, pt: 4, borderTop: "1px solid #2D2F39" }}>
                        <Typography sx={{ color: "#9AA6A8", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", mb: 1.5 }}>
                            Worker Access Key
                        </Typography>
                        <Box sx={{ 
                            display: "flex", alignItems: "center", bgcolor: "#0F1518", p: 2, borderRadius: "12px", 
                            border: "1px dashed #404F57", justifyContent: "space-between", transition: "0.3s",
                            "&:hover": { borderColor: "#8FFF9C" }
                        }}>
                            <Typography sx={{ color: "#8FFF9C", fontFamily: "monospace", fontSize: "14px", letterSpacing: 2 }}>
                                {showKey ? (worker.access_key || "wrk_live_xxxxxxxxxxxx") : "••••••••••••••••••••••••"}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <Tooltip title={showKey ? "Hide" : "Show"}>
                                    <IconButton size="small" onClick={() => setShowKey(!showKey)} sx={{ color: "#9AA6A8", "&:hover": { color: "#8FFF9C" } }}>
                                        {showKey ? <EyeClosedIcon fontSize="small" /> : <EyeOpenIcon fontSize="small" />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Copy Key">
                                    <IconButton size="small" onClick={() => navigator.clipboard.writeText(worker.access_key || "")} sx={{ color: "#9AA6A8", "&:hover": { color: "#8FFF9C" } }}>
                                        <CopyIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Job Assigned Area */}
            <Typography variant="h4" sx={{ color: "#E6F0E6", fontWeight: "bold", mb: 3 }}>Job Assigned</Typography>
            <Box sx={{ bgcolor: "#1E2429", p: 4, borderRadius: "20px", border: "1px solid #404F57", textAlign: 'center', color: '#404F57' }}>
                No active jobs currently assigned to this worker.
            </Box>

            {/* Modal สำหรับจัดการ Action */}
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