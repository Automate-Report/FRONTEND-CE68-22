"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { projectService } from "../../../services/project.service";
import { 
  Box, 
  Typography, 
  TextField, 
  Button,  
  Link as MuiLink 
} from "@mui/material";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

export default function CreateProjectPage() {
  const router = useRouter();
  
  // State สำหรับเก็บค่าใน Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // State สำหรับ UI interaction
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันเว็บ reload
    setLoading(true);
    setError(null);

    try {
      if (!name) throw new Error("Please enter project name");

      // 1. เรียก API
      const newProject = await projectService.create({
        name,
        description
      });

      // 2. สร้างสำเร็จ -> Redirect ไปหน้า Detail ของโปรเจกต์นั้นเลย
      // หรือจะกลับไปหน้า List ก็ได้: router.push("/projects/all");
      router.push(`/projects/${newProject.id}/overview`);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
        { label: "Home", href: "/main"},
        { label: "Create Project" , href: undefined}
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
                        {loading ? "Saving..." : "Create Project"}
                    </Button>
                </Box>
            </form>
    </div>
  );
}