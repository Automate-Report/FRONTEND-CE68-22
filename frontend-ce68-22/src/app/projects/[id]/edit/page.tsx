"use client";

import { use } from "react";
import {
    Box,
    Typography,
    Button,
    CircularProgress
} from "@mui/material";

// Components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { TagManager } from "@/src/components/projects/TagManager";

// Hooks
import { useEditProject } from "@/src/hooks/project/use-editProject";

//stles
import { muiGreenButtonStyle } from "@/src/styles/greenButton";
import { muiRedButtonStyle } from "@/src/styles/redButton";
import { INPUT_BOX_NO_ICON_STYLE, TEXT_AREA_STYLE } from "@/src/styles/inputBoxStyle";
import { RED_BUTTON_STYLE, GREEN_BUTTON_STYLE } from "@/src/styles/buttonStyle";

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
        <div className="flex flex-col items-center w-full py-4">
            <div className="w-full max-w-2xl">
                <GenericBreadcrums items={breadcrumbItems} />
                <form onSubmit={handlers.handleSubmit}>

                    {/* 2. Project Name */}
                    <div className="pb-6">
                        <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Project Name</div>
                        <input
                            type="text"
                            placeholder="e.g. CECompany"
                            className={INPUT_BOX_NO_ICON_STYLE + " w-full"}
                            value={formState.name}
                            onChange={(e) => setters.setName(e.target.value)}
                        />
                    </div>

                    {/* 3. Project Description */}
                    <div className="pb-4">
                        <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Project Description</div>
                        <textarea
                            placeholder="Details..."
                            rows={4}
                            className={TEXT_AREA_STYLE}
                            value={formState.description}
                            onChange={(e) => setters.setDescription(e.target.value)}
                        />
                    </div>

                    {/* <TagManager
                        tagRows={formState.tagRows}
                        availableTags={formState.availableTags}
                        fetchingTags={false}
                        onAddRow={handlers.handleAddTagRow}
                        onRemoveRow={handlers.handleRemoveTagRow}
                        onTagChange={handlers.handleTagChange}
                        onDeleteTagFromDb={handlers.handleDeleteTagFromDb}
                        onDropdownOpen={handlers.handleDropdownOpen}
                    /> */}

                    {/* Error Message */}
                    {status.error && (
                        <Typography color="error" variant="body2" sx={{ mt: 2, mb: 2 }}>
                            {status.error}
                        </Typography>
                    )}

                    {/* 5. Action Buttons */}
                    <Box sx={{ display: "flex", gap: 3.5, mt: 2 }}>
                        <button className={RED_BUTTON_STYLE + " w-[50%] justify-center"} onClick={() => router.back()} type="button" disabled={status.loading}>
                            Cancel
                        </button>

                        <button className={GREEN_BUTTON_STYLE + " w-[50%] justify-center"} type="submit" disabled={status.loading}>
                            {status.loading ? "Saving..." : "Save Change"}
                        </button>
                    </Box>
                </form>
            </div>
        </div>
    );
}
