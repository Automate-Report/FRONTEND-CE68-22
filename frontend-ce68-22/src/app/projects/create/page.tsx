// src/app/projects/create/page.tsx
"use client";

import { Box, Typography, TextField, Button } from "@mui/material";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { useCreateProject } from "@/src/hooks/project/use-createProject";
import { TagManager } from "@/src/components/projects/TagManager";

export default function CreateProjectPage() {
  // เรียกใช้ Hook ตัวเดียวได้ครบทุกอย่าง
  const { formState, setters, status, handlers } = useCreateProject();
  const { router } = useCreateProject(); // หรือเรียก router ใน component นี้ก็ได้

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: "Create Project", href: undefined }
  ];

  return (
    <div className="mx-12 py-8">
      <GenericBreadcrums items={breadcrumbItems} />

      <form onSubmit={handlers.handleSubmit}>
        {/* Project Name */}
        <div className="pb-8">
          <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Project Name</div>
          <TextField
            variant="outlined" fullWidth required
            value={formState.name}
            onChange={(e) => setters.setName(e.target.value)}
            placeholder="e.g. CECompany" size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#FBFBFB", borderRadius: "16px",
                "& fieldset": { borderColor: "#FBFBFB" },
                "&.Mui-focused fieldset": { borderColor: "#FBFBFB" },
                "& input": { fontSize: "16px", fontWeight: 300 }
              }
            }}
          />
        </div>

        {/* Project Description */}
        <div className="pb-8">
          <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Project Description</div>
          <TextField
            variant="outlined" fullWidth multiline rows={4}
            value={formState.description}
            onChange={(e) => setters.setDescription(e.target.value)}
            placeholder="Details..." size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#FBFBFB", borderRadius: "16px", padding: "12px",
                "& fieldset": { borderColor: "#FBFBFB" },
                "&.Mui-focused fieldset": { borderColor: "#FBFBFB" },
                "& textarea": { fontSize: "16px", fontWeight: 300 }
              }
            }}
          />
        </div>

        {/* Tag Manager Component */}
        <TagManager 
            selectedTags={formState.selectedTags}
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
          <Button variant="outlined" disabled={status.loading}
            // *หมายเหตุ: ต้อง import useRouter หรือส่งมาจาก hook
            onClick={() => window.history.back()} 
            sx={{ px: 3, borderRadius: "10px", borderColor: "#FE3B46", color: "#FE3B46" }}>Cancel</Button>
            
          <Button variant="contained" type="submit" disabled={status.loading}
            sx={{ px: 3, borderRadius: "10px", backgroundColor: "#8FFF9C", color: "#0B0F12" }}>
            {status.loading ? "Saving..." : "Create Project"}
          </Button>
        </Box>
      </form>
    </div>
  );
}