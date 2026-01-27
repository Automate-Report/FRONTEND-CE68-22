"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // เพิ่ม useParams
import { Box, Button, Typography, Tooltip, IconButton, CircularProgress } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import CustomTextField from "@/src/components/Common/CustomTextField";
import { workerService } from "@/src/services/worker.service";

// --- Styles ---
import { muiRedButtonStyle } from "@/src/styles/redButton";
import { muiGreenButtonStyle } from "@/src/styles/greenButton";

import { castInt } from "@/src/lib/format";

export default function EditWorkerPage() {
    const router = useRouter();
    const params = useParams(); // ดึง params จาก URL
    const workerId = castInt(params.id as string); // สมมติว่า URL คือ /workers/[id]/edit

    const [name, setName] = useState("");
    const [threads, setThreads] = useState<number | string>(1);
    
    // สถานะสำหรับการโหลดข้อมูลเริ่มต้น (Fetching Data)
    const [fetching, setFetching] = useState(true);
    // สถานะสำหรับการกด Save (Submitting)
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. ดึงข้อมูล Worker เดิมเมื่อเข้าหน้าเว็บ
    useEffect(() => {
        const fetchWorkerData = async () => {
            if (!workerId) return;

            setFetching(true);
            try {
                // สมมติว่าใน workerService มีฟังก์ชัน getById
                const data = await workerService.getById(workerId); 
                
                // Set ค่าเดิมลงใน Form
                setName(data.name);
                setThreads(data.thread_number || 1);
            } catch (err: any) {
                console.error(err);
                setError("Failed to fetch worker details.");
            } finally {
                setFetching(false);
            }
        };

        fetchWorkerData();
    }, [workerId]);

    // 2. ฟังก์ชันบันทึกการแก้ไข
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !threads) return;

        setSaving(true);
        setError(null);
        try {
            // เรียก API Update (PUT/PATCH)
            await workerService.edit(workerId, {
                name: name.trim(),
                thread_number: Number(threads)
            });
            
            // สำเร็จแล้วกลับไปหน้า List
            router.push("/workers"); 
        } catch (err: any) {
            setError(err.message || "Failed to update worker");
        } finally {
            setSaving(false);
        }
    };

    const breadcrumbItems = [
        { label: "Workers", href: "/workers" },
        { label: "Edit Worker", href: undefined } // เปลี่ยน Label
    ];

    // กรณีที่กำลังโหลดข้อมูลเริ่มต้น ให้แสดง Loading
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
                {/* Worker Name */}
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

                {/* Number of Threads พร้อม Tooltip */}
                <div className="pb-8">
                    <div className="flex items-center gap-2 pb-4">
                        <div className="text-[#E6F0E6] font-bold text-[24px]">Number of Threads</div>
                        <Tooltip 
                            title="Set the number of concurrent tasks this worker can process."
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

                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
                    <Button 
                        variant="outlined" 
                        disabled={saving} 
                        onClick={() => router.back()} 
                        sx={muiRedButtonStyle}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        type="submit" 
                        disabled={saving || !name.trim()} 
                        sx={muiGreenButtonStyle}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </Box>
            </form>
        </div>
    );
}