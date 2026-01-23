"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Services
import { projectService } from "../../../services/project.service";
import { TagService } from "../../../services/tag.service";
import { getMe } from "@/src/services/auth.service";
// Types
import { Tag } from "@/src/types/tag"; // อย่าลืมสร้างไฟล์ interface Tag { id: number; name: string; }
// UI Components
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  createFilterOptions,
  IconButton,
  CircularProgress
} from "@mui/material";
// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

// สร้าง Filter Options สำหรับ Autocomplete
const filter = createFilterOptions<Tag>();

export default function CreateProjectPage() {
  const router = useRouter();

  // --- State Form ---
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // --- State Tags ---
  // selectedTags: เก็บเป็น "ชื่อ Tag" (String) เพื่อแสดงผลใน Input
  const [selectedTags, setSelectedTags] = useState<string[]>([""]); 
  
  // availableTags: เก็บเป็น "Object Tag" (มี id, name) ที่ดึงจาก DB
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  
  // Loading States
  const [fetchingTags, setFetchingTags] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Init: ดึง Tag ทั้งหมดเมื่อเข้าหน้าเว็บ ---
  useEffect(() => {
    const initTags = async () => {
        try {
            setFetchingTags(true);
            const getme = await getMe();
            const tags = await TagService.getAll(getme["user"]);
            setAvailableTags(tags);
        } catch (err) {
            console.error("Error fetching tags:", err);
            setAvailableTags([]);
        } finally {
            setFetchingTags(false);
        }
    };
    initTags();
  }, []);

  // --- Logic: เพิ่ม/ลบ แถว Dropdown ---
  const handleAddTagRow = () => {
    setSelectedTags([...selectedTags, ""]);
  };

  const handleRemoveTagRow = (index: number) => {
    const newTags = [...selectedTags];
    newTags.splice(index, 1);
    setSelectedTags(newTags);
  };

  // --- Logic: ลบ Tag ถาวรออกจาก DB (ปุ่มกากบาทเล็กใน Dropdown) ---
  const handleDeleteTagFromDb = async (tagToDelete: Tag) => {
    if (confirm(`Are you sure you want to permanently delete the tag "${tagToDelete.name}"?`)) {
        try {
            await TagService.delete(tagToDelete.id);
            
            // อัปเดต State: เอาออกจาก availableTags
            setAvailableTags((prev) => prev.filter((t) => t.id !== tagToDelete.id));
            
            // อัปเดต State: ถ้าแถวไหนเลือก Tag นี้อยู่ ให้เคลียร์ค่าออก
            setSelectedTags((prev) => prev.map((tName) => tName === tagToDelete.name ? "" : tName));

        } catch (err) {
            console.error("Failed to delete tag:", err);
            alert("Failed to delete tag. It might be in use.");
        }
    }
  };

  // --- Logic: จัดการการเลือก/สร้าง Tag ใน Dropdown ---
  const handleTagChange = async (index: number, newValue: string | Tag | null) => {
    const newTags = [...selectedTags];

    // 1. กรณี Clear ค่า (User ลบข้อความใน input จนหมด)
    if (newValue === null) {
        newTags[index] = "";
        setSelectedTags(newTags);
        return;
    }

    // 2. กรณี Create New Tag (User พิมพ์ใหม่แล้วเลือก Add "...")
    // หมายเหตุ: MUI freeSolo อาจส่งมาเป็น string ที่พิมพ์ หรือ Object ที่เรา push เข้าไปใน filterOptions
    if (typeof newValue === 'string' && newValue.startsWith('Add "')) {
        // กรณีเป็น String (ไม่ค่อยเกิดถ้าเรา Handle ใน filterOptions ดีๆ แต่กันไว้)
        const rawName = newValue.replace('Add "', '').replace('"', '');
        await createNewTagAndSelect(index, rawName, newTags);
    } 
    else if (typeof newValue === 'object' && 'inputValue' in newValue) {
        // กรณีเลือกตัวเลือก Add "..." ที่เราสร้าง object หลอกไว้
        // (เราจะ cast type เป็น any ตอน push เพื่อใส่ inputValue)
        const rawName = (newValue as any).inputValue;
        await createNewTagAndSelect(index, rawName, newTags);
    }
    // 3. กรณีเลือก Tag ปกติที่มีอยู่แล้ว
    else if (typeof newValue === 'object' && 'name' in newValue) {
        newTags[index] = newValue.name;
        setSelectedTags(newTags);
    }
    // 4. กรณีพิมพ์เองแล้วกด Enter (เป็น string เพียวๆ)
    else if (typeof newValue === 'string') {
        // เช็คว่ามีอยู่แล้วหรือยัง
        const existingTag = availableTags.find(t => t.name.toLowerCase() === newValue.toLowerCase());
        if (existingTag) {
            newTags[index] = existingTag.name;
            setSelectedTags(newTags);
        } else {
            // ถ้าไม่มี ให้สร้างใหม่เลย
            await createNewTagAndSelect(index, newValue, newTags);
        }
    }
  };

  // Helper Function: สร้าง Tag ใหม่แล้วเลือกให้เลย
  const createNewTagAndSelect = async (index: number, tagName: string, currentTags: string[]) => {
      try {
          const getme = await getMe();
          const newTagObj = await TagService.create(tagName, getme["user"]);
          setAvailableTags((prev) => [...prev, newTagObj]); // เพิ่มเข้า List
          currentTags[index] = newTagObj.name; // เลือกเลย
          setSelectedTags(currentTags);
      } catch (err) {
          console.error("Failed to create tag:", err);
          alert("Failed to create new tag.");
      }
  }

  // --- Submit Form ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!name) throw new Error("Please enter project name");
      
      const getme = await getMe();

      // 1. กรองชื่อ Tag ที่ว่างเปล่าทิ้ง
      const validTagNames = selectedTags.filter(tag => tag.trim() !== "");

      // 2. แปลงชื่อ Tag -> ID (ต้องหาใน availableTags)
      const tagIds = validTagNames.map(tagName => {
          const foundTag = availableTags.find(t => t.name === tagName);
          return foundTag ? foundTag.id : null;
      }).filter((id) => id !== null) as number[];

      // 3. ส่งข้อมูล (API Create Project)
      const newProject = await projectService.create({
        name,
        description,
        user_id: getme["user"],
        tag_ids: tagIds // ส่งเป็น ID
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

        {/* --- Project Tags Section --- */}
        <div className="pb-8">
            <div className="text-[#E6F0E6] font-bold text-[24px] pb-4">Project Tags</div>
            
            {fetchingTags ? (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', color: '#888' }}>
                    <CircularProgress size={20} /> Loading tags...
                </Box>
            ) : (
                selectedTags.map((tagValue, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        <Autocomplete
                            disableClearable
                            freeSolo
                            fullWidth
                            // options คือ List ของ Object Tag
                            options={availableTags} 
                            
                            // Map ค่า tagValue (string) ให้ตรงกับ Object ใน options
                            value={availableTags.find(t => t.name === tagValue) || tagValue}
                            
                            getOptionLabel={(option) => {
                                // Handle กรณีที่เป็น String หรือ Object
                                if (typeof option === 'string') return option;
                                return option.name;
                            }}

                            onChange={(event, newValue) => {
                                // ดักจับการเลือก "ลบแถว"
                                if (typeof newValue === 'object' && newValue !== null && 'name' in newValue && newValue.name === "DELETE_ROW_ACTION") {
                                    handleRemoveTagRow(index);
                                    return;
                                }
                                handleTagChange(index, newValue);
                            }}

                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                const { inputValue } = params;

                                // เช็คว่า input ที่พิมพ์ มีอยู่แล้วหรือยัง
                                const isExisting = options.some((option) => option.name.toLowerCase() === inputValue.toLowerCase());
                                
                                // ถ้ายังไม่มี ให้แสดงตัวเลือก "Add..."
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push({
                                        inputValue,
                                        name: `Add "${inputValue}"`,
                                        id: 0 // ID ปลอม
                                    } as any);
                                }

                                // เพิ่มตัวเลือก Remove Row ไว้ล่างสุด
                                filtered.push({
                                    id: -999,
                                    name: "DELETE_ROW_ACTION" 
                                } as Tag);

                                return filtered;
                            }}

                            renderOption={(props, option) => {
                                const { key, ...otherProps } = props;
                                const optionName = typeof option === 'string' ? option : option.name;

                                // 1. ตัวเลือก Remove Row
                                if (optionName === "DELETE_ROW_ACTION") {
                                    return (
                                        <li key={key} {...otherProps} style={{ color: '#d32f2f', borderTop: '1px solid #eee' }}>
                                            <DeleteOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
                                            Remove this row
                                        </li>
                                    );
                                }

                                // 2. ตัวเลือก Add New Tag
                                if (optionName.startsWith('Add "')) {
                                    return (
                                        <li key={key} {...otherProps} style={{ color: '#1976d2' }}>
                                            <AddIcon sx={{ mr: 1, fontSize: 20 }} />
                                            {optionName}
                                        </li>
                                    );
                                }

                                // 3. ตัวเลือก Tag ปกติ (มีปุ่มลบจาก DB)
                                return (
                                    <li key={key} {...otherProps}>
                                        <div className="flex justify-between items-center w-full">
                                            <span>{optionName}</span>
                                            
                                            {/* ปุ่มลบ (แสดงเฉพาะเมื่อเป็น Object Tag จริงๆ) */}
                                            {typeof option !== 'string' && option.id > 0 && (
                                                <IconButton 
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteTagFromDb(option);
                                                    }}
                                                    sx={{ 
                                                        color: '#999', 
                                                        "&:hover": { color: '#d32f2f', backgroundColor: 'rgba(255,0,0,0.1)' } 
                                                    }}
                                                    title="Delete tag from system"
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            )}
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
                ))
            )}

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

        {/* Action Buttons */}
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