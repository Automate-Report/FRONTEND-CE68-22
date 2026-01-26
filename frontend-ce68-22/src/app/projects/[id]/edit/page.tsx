"use client";

import React, { use } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress 
} from "@mui/material";

// Components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { TagManager } from "@/src/components/projects/TagManager"; 
import CustomTextField from "@/src/components/Common/CustomTextField";


// Hooks
import { useEditProject } from "@/src/hooks/project/use-editProject";

//stles
import { muiGreenButtonStyle } from "@/src/styles/greenButton";
import { muiRedButtonStyle } from "@/src/styles/redButton";

export default function EditProjectPage({ params }: { params: Promise<{ id: number }> }) {
    // แกะ ID ออกมาจาก params (รองรับ Next.js 15+)
    const { id } = use(params);
    
    // เรียกใช้ Hook ที่เราเตรียมไว้ (Logic ทั้งหมดอยู่ที่นี่)
    const { formState, setters, status, handlers, router } = useEditProject(id);

    // Breadcrumbs
    const breadcrumbItems = [
        { label: "Home", href: "/main" },
        { label: formState.name || "Project", href: `/projects/${id}/overview` },
        { label: "Edit Project", href: undefined }
    ];

    // 1. Loading State (ตอนดึงข้อมูลเก่ามาแสดง)
    if (status.fetchingData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#8FFF9C' }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    return (
        <div className="mx-12 py-8">
            <GenericBreadcrums items={breadcrumbItems} />
            <form onSubmit={handlers.handleSubmit}>
                
                {/* 2. Project Name */}
                <div className="pb-8">
                    <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Project Name</div>
                    <CustomTextField
                        value={formState.name}
                        onChange={(e) => setters.setName(e.target.value)}
                        placeholder="e.g. CECompany" size="small"
                    />
                </div>

                {/* 3. Project Description */}
                <div className="pb-8">
                    <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Project Description</div>
                    <CustomTextField
                        multiline
                        rows={4}
                        value={formState.description}
                        onChange={(e) => setters.setDescription(e.target.value)}
                        placeholder="Details..." size="small"
                    />
                </div>
                <TagManager 
                    tagRows={formState.tagRows}
                    availableTags={formState.availableTags}
                    fetchingTags={false} 
                    onAddRow={handlers.handleAddTagRow}
                    onRemoveRow={handlers.handleRemoveTagRow}
                    onTagChange={handlers.handleTagChange}
                    onDeleteTagFromDb={handlers.handleDeleteTagFromDb}
                    onDropdownOpen={handlers.handleDropdownOpen}
                />

                {/* Error Message */}
                {status.error && (
                    <Typography color="error" variant="body2" sx={{ mt: 2, mb: 2 }}>
                        {status.error}
                    </Typography>
                )}

                {/* 5. Action Buttons */}
                <Box sx={{ display: "flex", gap: 3.5, mt: "16px", pt: "32px" }}>
                    <Button
                        variant="outlined"
                        onClick={() => router.back()}
                        disabled={status.loading}
                        sx={muiRedButtonStyle}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={status.loading}
                        sx={muiGreenButtonStyle}
                    >
                        {status.loading ? "Saving..." : "Save Changes"}
                    </Button>
                </Box>
            </form>
        </div>
    );
}