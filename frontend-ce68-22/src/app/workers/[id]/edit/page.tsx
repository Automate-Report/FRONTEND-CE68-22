"use client";

import { use, useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { useWorker } from "@/src/hooks/use-worker";

import { workerService } from "@/src/services/worker.service";


import { AccessKeyBoxSection } from "@/src/components/workers/AccessKeyBoxSection";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

import { 
    Box, 
    Typography, 
    TextField, 
    Button 
} from "@mui/material";

interface PageProps{
    params: Promise<{ id: string}>
}

export default function WorkerDetailPage({ params }: PageProps)
{
    const router = useRouter();

    const resolvePrams = use(params);
    const workerId = parseInt(resolvePrams.id);
    const { data: worker, isLoading: isFetching, isError, refetch } = useWorker(workerId);


    // State สำหรับเก็บค่าใน Form
    const [name, setName] = useState("");
      
    // State สำหรับ UI interaction
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (worker) {
            setName(worker.name);
        }
    }, [worker]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // เรียก Service edit
            await workerService.edit(workerId, {
                name
            });
          
            // สำเร็จ -> กลับไปหน้า worker นั้น 
            router.push(`/workers/${workerId}`);
        } catch (err: any) {
            console.error(err);
            setError("Failed to update worker");
        } finally {
            setLoading(false);
        }
    };
    
    if (isFetching) return <div className="p-8">Loading project data...</div>;

    const breadcrumbItems = [
        { label: "Worker", href: "/workers"},
        { label: worker?.name || "Worker" , href: `/workers/${workerId}`},
        { label: "Edit Worker", href: undefined }
    ];

    

    return (
        <div className="px-12 py-6 bg-[#0F1518] text-[#E6F0E6]">
            <GenericBreadcrums items={breadcrumbItems}/>

            <form onSubmit={handleSubmit}>
                {/* 1. Worker Name */}
                <div className="pb-8 w-1/3">
                    <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Worker Name</div>
                    <TextField
                        variant="outlined"
                        fullWidth
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. CECompany"
                        size="small"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#FBFBFB",
                                borderRadius: "16px",
                                                
                                "& fieldset": {
                                    borderColor: "#FBFBFB",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#FBFBFB", // หรือสี Primary ที่ต้องการ
                                },
                                // ปรับ Font ของ input ข้างใน
                                "& input": {
                                    fontSize: "16px",
                                    fontWeight: 300,
                                    color: "#000" // สีตัวอักษร
                                }
                            }
                        }}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
            
                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: "32px", mt: "32px" }}>
                    <Button
                        variant="outlined"
                        onClick={() => router.back()}
                        disabled={loading}
                        sx={{
                            px: 3,
                            textTransform: "none",
                            fontSize: 16,
                            fontWeight: 600,
                            borderColor: "#FE3B46",
                            color: "#FE3B46",
                            borderRadius: "10px",
                            "&:hover": {
                                borderColor: "#FE3B46",
                                backgroundColor: "#FE3B46",
                                color: "#FBFBFB"
                            }
                        }}
                    >
                        Cancel
                    </Button>
            
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        sx={{
                            px: 3,
                            textTransform: "none",
                            fontSize: 16,
                            fontWeight: 600,
                            backgroundColor: "#8FFF9C",
                            color: "#0B0F12",
                            borderRadius: "10px",
                            "&:hover": {
                                backgroundColor: "#AFFFB9"
                            }
                        }}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </Box>
            </form>
            
        </div>
    );
}