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
import { INPUT_BOX_NO_ICON_STYLE } from "@/src/styles/inputBoxStyle";
import { GREEN_BUTTON_STYLE, RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";

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
                const data = await workerService.getById(workerId, projectId);
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
        <div>
            <GenericBreadcrums items={breadcrumbItems} />

            <form onSubmit={handleSubmit} className="text-[#E6F0E6]">

                <div className="flex flex-col gap-6">

                    {/* Worker Name */}
                    <div className="flex flex-col w-[40%] gap-3">
                        <span className="font-semibold text-2xl">Worker Name</span>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className={INPUT_BOX_NO_ICON_STYLE} />
                    </div>

                    {/* Number of Thread */}
                    <div className="flex flex-col w-[40%] gap-3">
                        <div className="flex flex-row w-full gap-3">
                            <div className="font-semibold text-2xl">Number of Threads</div>
                            <Tooltip title="Set the number of concurrent tasks this worker can process.">
                                <IconButton size="small" sx={{ color: "#8FFF9C", p: 0 }}>
                                    <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <input type="text" value={threads} onChange={(e) => setThreads(e.target.value)}
                            className={INPUT_BOX_NO_ICON_STYLE} />
                    </div>

                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {typeof error === 'object' ? JSON.stringify(error) : String(error)}
                        </Typography>
                    )}
                    {/* Action Buttons */}
                    <div className="flex gap-8 items-center">
                        <button className={RED_BUTTON_STYLE}
                            type="button" onClick={() => router.back()}>Cancel</button>

                        <button className={GREEN_BUTTON_STYLE}
                            type="submit">{saving ? "Saving..." : "Save Changes"}</button>
                    </div>
                </div>
            </form>
        </div>
    );
}