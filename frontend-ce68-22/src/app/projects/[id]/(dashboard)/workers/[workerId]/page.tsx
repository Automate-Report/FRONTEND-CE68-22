"use client";

import { use, useState } from "react";

import { Tooltip, IconButton, Box, Typography, Stack, Divider } from "@mui/material";
import { 
  Assignment as TotalJobIcon, 
  CheckCircle as CompletedIcon, 
  Error as FailedIcon, 
  BugReport as FindingIcon,
  ContentCopy as CopyIcon, 
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
  SyncAlt as CurrentThreadIcon
} from "@mui/icons-material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useRouter } from "next/navigation";

import { useProject } from "@/src/hooks/project/use-project";

import { useWorker } from "@/src/hooks/worker/use-worker";
import { useWorkerDownload } from "@/src/hooks/worker/use-WorkerDownload";
import { workerService } from "@/src/services/worker.service";
import { Worker } from "@/src/types/worker";
import { WORKER_STATUS_MAP } from "@/src/constants/worker-status";

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

    const [showKey, setShowKey] = useState(false);

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

            {/*Summary status job */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { 
                    label: "Total Jobs", 
                    value: 0, 
                    color: "#FBFBFB", 
                    icon: <TotalJobIcon sx={{ fontSize: 24 }} /> 
                    },
                    { 
                    label: "Completed", 
                    value: 0, 
                    color: "#8FFF9C", 
                    icon: <CompletedIcon sx={{ fontSize: 24 }} /> 
                    },
                    { 
                    label: "Failed", 
                    value: 0, 
                    color: "#FE3B46", // อัปเดตเป็นสีแดงที่คุณระบุ
                    icon: <FailedIcon sx={{ fontSize: 24 }} /> 
                    },
                    { 
                    label: "Total Findings", 
                    value: 0, 
                    color: "#FFCC00", 
                    icon: <FindingIcon sx={{ fontSize: 24 }} /> 
                    },
                ].map((item, i) => (
                    <Box 
                    key={i} 
                    sx={{ 
                        bgcolor: "#1E2429", 
                        p: 2.5, 
                        borderRadius: "16px", 
                        border: "1px solid #404F57", 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': { 
                        transform: 'translateY(-4px)',
                        borderColor: item.color,
                        boxShadow: `0 4px 20px ${item.color}15` // แสงเรืองรองสีแดง #FE3B46 ตอน hover
                        }
                    }}
                    >
                    <Box>
                        <Typography variant="h4" sx={{ color: item.color, fontWeight: 900, lineHeight: 1 }}>
                        {item.value}
                        </Typography>
                        <Typography sx={{ color: "#9AA6A8", fontSize: "11px", fontWeight: 800, textTransform: 'uppercase', mt: 0.5 }}>
                        {item.label}
                        </Typography>
                    </Box>
                    <Box 
                        sx={{ 
                        width: 44, 
                        height: 44, 
                        borderRadius: "12px", 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: item.color, 
                        bgcolor: `${item.color}10`, 
                        border: `1px solid ${item.color}25` 
                        }}
                    >
                        {item.icon}
                    </Box>
                    </Box>
                ))}
            </div>

            {/*Worker Config*/}
            <Box sx={{ 
                bgcolor: "#1E2429", 
                borderRadius: "20px", 
                border: "1px solid #404F57", 
                overflow: "hidden" 
                }}>
                {/* Header ส่วนหัว */}
                <Box sx={{ 
                    px: 3, 
                    py: 2, 
                    borderBottom: "1px solid #404F57", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1.5,
                    bgcolor: "rgba(255, 255, 255, 0.02)"
                }}>
                    <ConfigIcon sx={{ color: "#8FFF9C", fontSize: 20 }} />
                    <Typography sx={{ color: "#E6F0E6", fontWeight: "bold", fontSize: "16px" }}>
                    Worker Configuration
                    </Typography>
                </Box>

                {/* เนื้อหา Config */}
                <Box sx={{ p: 3 }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        
                        {[
                        // ... ข้อมูลเดิมที่ส่งมา (Worker Name, Status, Hostname, IP, Created, Heartbeat)
                        
                        { 
                            label: "Worker Name", 
                            value: worker?.name || "Worker-01", 
                            icon: <WorkerNameIcon sx={{ fontSize: 18 }} />, 
                            color: "#FBFBFB" 
                        },
                        { 
                            label: "Status", 
                            value: worker?.status?.toUpperCase() || "OFFLINE", 
                            icon: <StatusIcon sx={{ fontSize: 10 }} />, 
                            color: worker?.status === 'online' ? "#8FFF9C" : "#FE3B46",
                            isStatus: true 
                        },
                        { 
                            label: "Max Threads", 
                            value: `${worker?.thread_number ?? 0} Threads`, 
                            icon: <ThreadIcon sx={{ fontSize: 18 }} />, 
                            color: "#FBFBFB" 
                        },
                        { 
                            label: "Current Threads", 
                            value: `${worker?.current_load ?? 0} Active`, 
                            icon: <CurrentThreadIcon sx={{ fontSize: 18 }} />, 
                            color: (worker?.current_load ?? 0) > 0 ? "#FFCC00" : "#9AA6A8" 
                        },
                        { 
                            label: "Hostname", 
                            value: worker?.hostname || "n/a", 
                            icon: <HostIcon sx={{ fontSize: 18 }} />, 
                            color: "#FBFBFB",
                            isMono: true 
                        },
                        { 
                            label: "IP Address", 
                            value: worker?.ip_address || "0.0.0.0", 
                            icon: <IpIcon sx={{ fontSize: 18 }} />, 
                            color: "#FBFBFB",
                            isMono: true 
                        },
                        { 
                            label: "Created Date", 
                            value: worker?.created_at || "2026-02-21 14:30", 
                            icon: <CalendarIcon sx={{ fontSize: 18 }} />, 
                            color: "#FBFBFB" 
                        },
                        { 
                            label: "Last Heartbeat", 
                            value: worker?.last_heartbeat || "Never", 
                            icon: <HeartbeatIcon sx={{ fontSize: 18 }} />, 
                            color: worker?.status === 'online' ? "#8FFF9C" : "#9AA6A8" 
                        },
                        { 
                            label: "Jobs Completed", 
                            value: worker?.jobs_completed ?? 0, 
                            icon: <SuccessIcon sx={{ fontSize: 18 }} />, 
                            color: "#8FFF9C",
                            isBold: true,
                            span: 2 
                        },
                        ].map((item, index) => (
                        <Box 
                            key={index} 
                            sx={{ 
                            gridColumn: item.span ? `span ${item.span}` : 'span 1' 
                            }}
                        >
                            <Typography sx={{ 
                            color: "#9AA6A8", 
                            fontSize: "11px", 
                            fontWeight: 800, 
                            textTransform: "uppercase", 
                            mb: 1, 
                            ml: 0.5,
                            letterSpacing: 1 
                            }}>
                            {item.label}
                            </Typography>

                            <Box 
                            sx={{ 
                                bgcolor: "#0F1518", 
                                px: 2, 
                                py: 1.5, 
                                borderRadius: "12px", 
                                border: "1px solid #2D2F39",
                                display: 'flex',
                                alignItems: 'center',
                                minHeight: "48px",
                                transition: "border-color 0.2s",
                                "&:hover": { borderColor: "#404F57" }
                            }}
                            >
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                                <Box sx={{ color: item.color, display: 'flex', opacity: 0.8 }}>
                                {item.icon}
                                </Box>
                                <Typography sx={{ 
                                color: item.color, 
                                fontSize: item.isBold ? "18px" : "15px", 
                                fontWeight: item.isBold || item.isStatus ? "bold" : "500",
                                fontFamily: item.isMono ? "monospace" : "inherit",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                                }}>
                                {item.value}
                                </Typography>
                            </Stack>
                            </Box>
                        </Box>
                        ))}
                    </div>

                    {/* ส่วนล่าง: Access Key Box */}
                    <Box sx={{ mt: 4 }}>
                        <Typography sx={{ color: "#9AA6A8", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", mb: 1 }}>
                            Access Key
                        </Typography>
                        <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            bgcolor: "#0F1518", 
                            p: 2, 
                            borderRadius: "12px", 
                            border: "1px dashed #404F57",
                            justifyContent: "space-between",
                            transition: "border-color 0.3s",
                            "&:hover": { borderColor: "#8FFF9C" }
                        }}>
                            <Typography sx={{ 
                            color: "#8FFF9C", 
                            fontFamily: "monospace", 
                            fontSize: "14px", 
                            letterSpacing: 2,
                            // ถ้า showKey เป็น false ให้ทำเป็นจุดไข่ปลา
                            // filter: showKey ? "none" : "blur(4px)",
                            transition: "filter 0.2s"
                            }}>
                            {showKey ? (worker?.access_key || "wrk_live_xxxxxxxxxxxx") : "••••••••••••••••••••••••"}
                            </Typography>

                            <Stack direction="row" spacing={1}>
                            {/* ปุ่มเปิด/ปิดตา */}
                            <Tooltip title={showKey ? "Hide Key" : "Show Key"}>
                                <IconButton 
                                size="small" 
                                onClick={() => setShowKey(!showKey)}
                                sx={{ color: "#9AA6A8", "&:hover": { color: "#8FFF9C" } }}
                                >
                                {showKey ? <EyeClosedIcon fontSize="small" /> : <EyeOpenIcon fontSize="small" />}
                                </IconButton>
                            </Tooltip>

                            {/* ปุ่ม Copy */}
                            <Tooltip title="Copy Key">
                                <IconButton 
                                size="small" 
                                onClick={() => {
                                    navigator.clipboard.writeText(worker?.access_key || "");
                                    // เพิ่ม Logic แจ้งเตือน (Snackbar/Toast) ตรงนี้ได้ครับ
                                }}
                                sx={{ color: "#9AA6A8", "&:hover": { color: "#8FFF9C" } }}
                                >
                                <CopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            </Stack>
                        </Box>
                        <Typography sx={{ color: "#404F57", fontSize: "11px", mt: 1 }}>
                            * Keep this key secret. Click the eye icon to reveal the key for configuration.
                        </Typography>
                    </Box>
                </Box>
            </Box>


            {/*Job History */}
            <div>

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