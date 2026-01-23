"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { projectService } from "../../../../services/project.service";
import { getMe } from "@/src/services/auth.service";
import { useProject } from "@/src/hooks/project/use-project";
import { 
  Box, 
  Typography, 
  TextField, 
  Button 
} from "@mui/material";
// ตรวจสอบ path และชื่อไฟล์ให้ตรงกับที่คุณสร้างจริง (GenericBreadcrumbs vs GenericBreadcrums)
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums"; 

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
  
    const { id } = use(params);
    const projectId = parseInt(id);

    const { data: project, isLoading: isFetching } = useProject(projectId);

    // State สำหรับเก็บค่าใน Form
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
  
    // State สำหรับ UI interaction
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (project) {
            setName(project.name);
            setDescription(project.description || "");
        }
    }, [project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            const getme = await getMe();
            // เรียก Service edit
            await projectService.edit(projectId, {
                name,
                description,
                user_id: getme["user"]
            });
      
            // สำเร็จ -> กลับไปหน้า Overview
            router.push(`/projects/${projectId}/overview`);
        } catch (err: any) {
            console.error(err);
            setError("Failed to update project");
        } finally {
            setLoading(false);
        }
    };

    if (isFetching) return <div className="p-8">Loading project data...</div>;

    const breadcrumbItems = [
        { label: "Home", href: "/main" },
        { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
        { label: "Edit Project", href: undefined }
    ];

    return (
        <div className="mx-12 py-8">
            <GenericBreadcrums items={breadcrumbItems} />
            
            <form onSubmit={handleSubmit}>
                {/* 1. Project Name */}
                <div className="pb-8">
                    <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Project Name</div>
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

                {/* 2. Project Description */}
                <div className="pb-6">
                    <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Project Description</div>
                    <TextField
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4} // กำหนดจำนวนบรรทัดเริ่มต้น
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief details about this project..."
                        size="small"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#FBFBFB",
                                borderRadius: "16px",
                                padding: "12px", // เพิ่ม padding ให้สวยงามสำหรับ multiline

                                "& fieldset": {
                                    borderColor: "#FBFBFB",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#FBFBFB",
                                },
                                // สำหรับ Multiline ต้องปรับที่ textarea
                                "& textarea": {
                                    fontSize: "16px",
                                    fontWeight: 300,
                                    color: "#000"
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
                <Box sx={{ display: "flex", gap: 3.5, mt: 2 }}>
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