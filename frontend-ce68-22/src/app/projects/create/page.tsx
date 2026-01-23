"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { projectService } from "../../../services/project.service";
import { getMe } from "@/src/services/auth.service";
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  createFilterOptions,
  IconButton
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close'; // ใช้สำหรับลบ Tag ออกจาก List
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

// Mock Data
const INITIAL_AVAILABLE_TAGS = ["Development", "Design", "Marketing", "Research", "Urgent"];

const filter = createFilterOptions<string>();

export default function CreateProjectPage() {
  const router = useRouter();

  // --- State Form ---
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // --- State Tags ---
  const [selectedTags, setSelectedTags] = useState<string[]>([""]); 
  const [availableTags, setAvailableTags] = useState<string[]>(INITIAL_AVAILABLE_TAGS); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Logic การจัดการ Tag ---

  const handleAddTagRow = () => {
    setSelectedTags([...selectedTags, ""]);
  };

  const handleRemoveTagRow = (index: number) => {
    const newTags = [...selectedTags];
    newTags.splice(index, 1);
    setSelectedTags(newTags);
  };

  // !!! เพิ่มฟังก์ชันใหม่: ลบ Tag ออกจากรายการตัวเลือก (Dropdown) !!!
  const handleDeleteFromAvailable = (tagToDelete: string) => {
    if (confirm(`Are you sure you want to remove "${tagToDelete}" from the list?`)) {
        // 1. ลบออกจากรายการตัวเลือก
        setAvailableTags((prev) => prev.filter((t) => t !== tagToDelete));

        // 2. (Optional) ถ้า Tag นั้นถูกเลือกอยู่ในช่องไหนสักช่อง ให้เคลียร์ออกด้วย
        setSelectedTags((prev) => prev.map((t) => t === tagToDelete ? "" : t));
    }
  };

  const handleTagChange = (index: number, newValue: string | null) => {
    const newTags = [...selectedTags];
    
    // กรณี Clear ค่า
    if (newValue === null) {
        newTags[index] = "";
        setSelectedTags(newTags);
        return;
    }

    // กรณี Create New
    if (newValue.startsWith('Add "')) {
        const realValue = newValue.replace('Add "', '').replace('"', '');
        if (!availableTags.includes(realValue)) {
            setAvailableTags((prev) => [...prev, realValue]);
        }
        newTags[index] = realValue;
    } else {
        // กรณีเลือกปกติ
        newTags[index] = newValue;
    }

    setSelectedTags(newTags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!name) throw new Error("Please enter project name");
      
      const validTags = selectedTags.filter(tag => tag.trim() !== "");
      const getme = await getMe();

      const newProject = await projectService.create({
        name,
        description,
        user_id: getme["user"],
        tags: validTags 
      });

      router.push(`/projects/${newProject.id}/overview`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: "Create Project", href: undefined }
  ];

  return (
    <div className="mx-12 py-8">
      <GenericBreadcrums items={breadcrumbItems} />

      <form onSubmit={handleSubmit}>
        {/* Project Name */}
        <div className="pb-8">
             <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Project Name</div>
             <TextField 
                variant="outlined" fullWidth required value={name} 
                onChange={(e) => setName(e.target.value)} 
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
                variant="outlined" fullWidth multiline rows={4} value={description} 
                onChange={(e) => setDescription(e.target.value)} 
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

        {/* --- Project Tags --- */}
        <div className="pb-8">
            <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Project Tags</div>
            
            {selectedTags.map((tagValue, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                    <Autocomplete
                        disableClearable // ซ่อนปุ่ม x เดิมของ input
                        freeSolo
                        fullWidth
                        options={availableTags}
                        value={tagValue}
                        
                        onChange={(event, newValue) => {
                            if (newValue === "DELETE_ROW_ACTION") {
                                handleRemoveTagRow(index);
                                return;
                            }
                            // Logic เดิม...
                            let finalValue = newValue;
                            if (typeof newValue === 'string' && newValue.startsWith('Add "')) {
                                finalValue = newValue.replace('Add "', '').replace('"', '');
                                if (!availableTags.includes(finalValue)) {
                                    setAvailableTags((prev) => [...prev, finalValue]);
                                }
                            }
                            if(finalValue) handleTagChange(index, finalValue as string);
                        }}

                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            const { inputValue } = params;
                            const isExisting = options.some((option) => option === inputValue);
                            if (inputValue !== '' && !isExisting) filtered.push(`Add "${inputValue}"`);
                            if (!filtered.includes("DELETE_ROW_ACTION")) filtered.push("DELETE_ROW_ACTION");
                            return filtered;
                        }}

                        // !!! จุดสำคัญแก้ไขตรงนี้ !!!
                        renderOption={(props, option) => {
                            const { key, ...otherProps } = props;

                            // 1. ตัวเลือกสำหรับ "ลบแถวนี้ทิ้ง" (Remove row)
                            if (option === "DELETE_ROW_ACTION") {
                                return (
                                    <li key={key} {...otherProps} style={{ color: '#d32f2f', borderTop: '1px solid #eee' }}>
                                        <DeleteOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
                                        Remove this row
                                    </li>
                                );
                            }

                            // 2. ตัวเลือกสำหรับ "สร้าง Tag ใหม่"
                            if (option.startsWith('Add "')) {
                                return (
                                    <li key={key} {...otherProps} style={{ color: '#1976d2' }}>
                                        <AddIcon sx={{ mr: 1, fontSize: 20 }} />
                                        {option}
                                    </li>
                                );
                            }

                            // 3. ตัวเลือก Tag ปกติ (เพิ่มปุ่มลบด้านขวา)
                            return (
                                <li key={key} {...otherProps}>
                                    <div className="flex justify-between items-center w-full">
                                        <span>{option}</span>
                                        
                                        {/* ปุ่มลบ Tag ออกจาก Dropdown */}
                                        <IconButton 
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation(); // สำคัญมาก! ป้องกันไม่ให้ Event คลิกทะลุไปเลือก Tag
                                                handleDeleteFromAvailable(option);
                                            }}
                                            sx={{ 
                                                color: '#999', 
                                                "&:hover": { color: '#d32f2f', backgroundColor: 'rgba(255,0,0,0.1)' } 
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                </li>
                            );
                        }}

                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                placeholder="Select or Create a tag"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#FBFBFB", borderRadius: "16px",
                                        "& fieldset": { borderColor: "#FBFBFB" },
                                        "&.Mui-focused fieldset": { borderColor: "#FBFBFB" },
                                        "& input": { fontSize: "16px", fontWeight: 300 }
                                    }
                                }}
                            />
                        )}
                    />
                </Box>
            ))}

            <Button 
                startIcon={<AddIcon />}
                onClick={handleAddTagRow}
                sx={{
                    textTransform: "none", fontSize: 16, fontWeight: 600, color: "#FE3B46",
                    "&:hover": { backgroundColor: "rgba(254, 59, 70, 0.08)" }
                }}
            >
                Add another tag
            </Button>
        </div>

        {/* Buttons & Errors */}
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Box sx={{ display: "flex", gap: 3.5, mt: 2 }}>
          <Button variant="outlined" onClick={() => router.back()} disabled={loading}
            sx={{ px: 3, borderRadius: "10px", borderColor: "#FE3B46", color: "#FE3B46" }}>Cancel</Button>
          <Button variant="contained" type="submit" disabled={loading}
            sx={{ px: 3, borderRadius: "10px", backgroundColor: "#8FFF9C", color: "#0B0F12" }}>
            {loading ? "Saving..." : "Create Project"}
          </Button>
        </Box>
      </form>
    </div>
  );
}