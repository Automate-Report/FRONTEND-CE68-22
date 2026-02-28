"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; 
import { Box, Button, Typography, Tooltip, IconButton, CircularProgress } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import CustomTextField from "@/src/components/Common/CustomTextField";
import { workerService } from "@/src/services/worker.service";
import { useProject } from "@/src/hooks/project/use-project"; // ✅ ดึงชื่อโปรเจกต์มาทำ Breadcrumb

import { muiRedButtonStyle } from "@/src/styles/redButton";
import { muiGreenButtonStyle } from "@/src/styles/greenButton";
import { castInt } from "@/src/lib/format";

import { toast } from "react-hot-toast";

export default function EditWorkerPage() {
    const router = useRouter();
    const params = useParams(); 
    
    // ✅ แก้ไขจุดที่ 1: แยก ID ให้ชัดเจน
    const projectId = castInt(params.id as string);      // เลข 21
    const workerId = castInt(params.workerId as string); // ไอดีของ Worker จริงๆ
    
    const { data: project } = useProject(projectId); // เพื่อเอาชื่อโปรเจกต์

    const [name, setName] = useState("");
    const [threads, setThreads] = useState<number | string>(1);
    const [fetching, setFetching] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. ดึงข้อมูล Worker เดิม
    useEffect(() => {
        const fetchWorkerData = async () => {
            if (!workerId) return;
            setFetching(true);
            try {
                // ✅ แก้ไขจุดที่ 2: ใช้ workerId (ไม่ใช่ projectId)
                const data = await workerService.getById(workerId); 
                setName(data.name);
                setThreads(data.thread_number || 1);
            } catch (err: any) {
                console.error(err);
                setError("Worker not found or API error.");
            } finally {
                setFetching(false);
            }
        };
        fetchWorkerData();
    }, [workerId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            name: name.trim(),
            thread_number: parseInt(String(threads), 10) // ✅ บังคับให้เป็น Integer แน่นอน
        };
        console.log("Submitting payload:", payload);

        try {
            await workerService.edit(workerId, projectId, payload);
            
            toast.success("Worker updated successfully!"); // ✅ เพิ่ม Feedback
            
            router.push(`/projects/${projectId}/workers`); 
            router.refresh(); // บังคับให้ Server Component โหลดข้อมูลใหม่
        } catch (err: any) {
            console.error("Update Error:", err);
            
            // ตรวจสอบว่ามีข้อมูล Error จาก Backend (FastAPI Validation) หรือไม่
            const backendError = err.response?.data?.detail;

            if (Array.isArray(backendError)) {
                // กรณี FastAPI ส่งมาเป็น Array ของ Error (เช่น Validation failed)
                setError(backendError[0]?.msg || "Invalid input data");
            } else if (typeof backendError === 'string') {
                // กรณีส่งมาเป็น String (เช่น HTTPException)
                setError(backendError);
            } else {
                setError(err.message || "Failed to update worker");
            }
        } finally {
            setSaving(false);
        }
    };

    const breadcrumbItems = [
        { label: "Home", href: "/main" },
        { label: project?.name || "Project", href: `/projects/${projectId}/workers` },
        { label: "Edit Worker", href: undefined }
    ];

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-[50vh] text-[#E6F0E6]">
                <CircularProgress color="inherit" />
            </div>
        );
    }

    return (
        <div className="mx-12 py-8">
            <GenericBreadcrums items={breadcrumbItems} />
            
            <form onSubmit={handleSubmit} className="mt-8">
                <div className="pb-8">
                    <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Worker Name</div>
                    <CustomTextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Scanner-Node-01" 
                        size="small"
                        fullWidth
                    />
                </div>

                <div className="pb-8 w-fit">
                    <div className="flex items-center gap-2 pb-4">
                        <div className="text-[#E6F0E6] font-bold text-[24px]">Number of Threads</div>
                        <Tooltip title="Set the number of concurrent tasks this worker can process.">
                            <IconButton size="small" sx={{ color: "#8FFF9C", p: 0 }}>
                                <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <CustomTextField
                        type="number"
                        value={threads}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || Number(val) >= 1) setThreads(val);
                        }}
                        placeholder="1" 
                        size="small"
                        fullWidth
                    />
                </div>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {typeof error === 'object' ? JSON.stringify(error) : String(error)}
                    </Typography>
                )}

                <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
                    <Button variant="outlined" disabled={saving} onClick={() => router.back()} sx={muiRedButtonStyle}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit" disabled={saving || !name.trim()} sx={muiGreenButtonStyle}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </Box>
            </form>
        </div>
    );
}