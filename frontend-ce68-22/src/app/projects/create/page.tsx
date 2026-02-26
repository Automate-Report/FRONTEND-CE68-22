// src/app/projects/create/page.tsx
"use client";

import { Box, Typography, Button } from "@mui/material";

import { useCreateProject } from "@/src/hooks/project/use-createProject";
import { TagManager } from "@/src/components/projects/TagManager";

import { muiGreenButtonStyle } from "@/src/styles/greenButton";
import { muiRedButtonStyle } from "@/src/styles/redButton";
import { INPUT_BOX_NO_ICON_STYLE, TEXT_AREA_STYLE } from "@/src/styles/inputBoxStyle";
import { RED_BUTTON_STYLE, GREEN_BUTTON_STYLE } from "@/src/styles/buttonStyle";



export default function CreateProjectPage() {
  // เรียกใช้ Hook ตัวเดียวได้ครบทุกอย่าง
  const { formState, setters, status, handlers } = useCreateProject();
  const { router } = useCreateProject(); // หรือเรียก router ใน component นี้ก็ได้

  return (
    <div className="flex flex-col items-center w-full py-8">
      <div className="w-full max-w-2xl">
        <div className="text-4xl text-[#E6F0E6] font-bold pb-10">
          Create New Project
        </div>

        <form onSubmit={handlers.handleSubmit}>
          {/* Project Name */}
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

          {/* Project Description */}
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

          {/* Tag Manager Component */}
          <TagManager
            tagRows={formState.tagRows}
            availableTags={formState.availableTags}
            fetchingTags={status.fetchingTags}
            onAddRow={handlers.handleAddTagRow}
            onRemoveRow={handlers.handleRemoveTagRow}
            onTagChange={handlers.handleTagChange}
            onDeleteTagFromDb={handlers.handleDeleteTagFromDb}
            onDropdownOpen={handlers.handleDropdownOpen}
          />

          {/* Action Buttons */}
          {status.error && <Typography color="error" sx={{ mb: 2 }}>{status.error}</Typography>}

          <Box sx={{ display: "flex", gap: 3.5, mt: 2 }}>
            <button className={RED_BUTTON_STYLE + " w-[50%] justify-center"} onClick={() => router.back()} type="button" disabled={status.loading}>
              Cancel
            </button>

            <button className={GREEN_BUTTON_STYLE + " w-[50%] justify-center"} type="submit" disabled={status.loading}>
              {status.loading ? "Saving..." : "Create Project"}
            </button>
          </Box>
        </form>
      </div>
    </div>
  );
}