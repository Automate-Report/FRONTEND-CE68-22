"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
// Services
import { projectService } from "../../../services/project.service";
import { TagService } from "../../../services/tag.service";
import { getMe } from "@/src/services/auth.service";
// Types
import { Tag } from "@/src/types/tag";
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

const filter = createFilterOptions<Tag>();

export default function CreateProjectPage() {
  const router = useRouter();

  // --- State Form ---
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // --- State Tags ---
  const [selectedTags, setSelectedTags] = useState<string[]>([""]); 
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  
  // เก็บ UserID ไว้เพื่อใช้ในการ fetch tags ซ้ำๆ โดยไม่ต้องเรียก getMe บ่อยเกินไป
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Loading States
  const [fetchingTags, setFetchingTags] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- ฟังก์ชันกลางสำหรับดึง Tags ล่าสุด ---
  // ใช้ useCallback เพื่อให้ React ไม่สร้างฟังก์ชันใหม่ทุกครั้งที่ render
  const fetchLatestTags = useCallback(async (uid: string) => {
      try {
          // ไม่ตั้ง loading true ตรงนี้เพื่อให้ UI ไม่กระตุกเวลากด Dropdown บ่อยๆ
          // หรือถ้าอยากให้ขึ้น loading หมุนๆ ทุกครั้งที่กด ก็ uncomment บรรทัดล่างได้ครับ
          // setFetchingTags(true); 
          
          const tags = await TagService.getAll(uid);
          setAvailableTags(tags);
      } catch (err) {
          console.error("Error fetching tags:", err);
      } finally {
          setFetchingTags(false);
      }
  }, []);

  // --- 1. Init: ดึง User ID และ Tags ครั้งแรก ---
  useEffect(() => {
    const initData = async () => {
        try {
            setFetchingTags(true);
            const me = await getMe();
            const uid = me["user"]; // หรือ me.id ตาม structure จริงของคุณ
            
            // !!! จุดสำคัญ: เช็คให้ชัวร์ก่อนยิง !!!
            if (uid && uid !== "undefined" && uid !== "null") {
                setCurrentUserId(uid);
                setFetchingTags(true); // เริ่มหมุนตรงนี้
                await fetchLatestTags(uid);
            } else {
                console.log("Waiting for valid User ID...");
            }
        } catch (err) {
            console.error("Error init data:", err);
        } finally {
            setFetchingTags(false);
        }
    };
    initData();
  }, [fetchLatestTags]);

  // --- Handler: เมื่อกดเปิด Dropdown (onOpen) ---
  const handleDropdownOpen = () => {
      if (currentUserId) {
          fetchLatestTags(currentUserId);
      }
  };

  // --- Logic: เพิ่ม/ลบ แถว Dropdown ---
  const handleAddTagRow = () => {
    setSelectedTags([...selectedTags, ""]);
  };

  const handleRemoveTagRow = (index: number) => {
    const newTags = [...selectedTags];
    newTags.splice(index, 1);
    setSelectedTags(newTags);
  };

  // --- Logic: ลบ Tag ถาวรออกจาก DB ---
  const handleDeleteTagFromDb = async (tagToDelete: Tag) => {
    if (confirm(`Are you sure you want to permanently delete the tag "${tagToDelete.name}"?`)) {
        try {
            await TagService.delete(tagToDelete.id);
            
            // 1. อัปเดต UI Local ทันที (Optimistic update)
            setAvailableTags((prev) => prev.filter((t) => t.id !== tagToDelete.id));
            setSelectedTags((prev) => prev.map((tName) => tName === tagToDelete.name ? "" : tName));

            // 2. Re-fetch เพื่อความชัวร์ (ตาม requirement)
            if (currentUserId) await fetchLatestTags(currentUserId);

        } catch (err) {
            console.error("Failed to delete tag:", err);
            alert("Failed to delete tag.");
        }
    }
  };

  // --- Logic: จัดการการเลือก/สร้าง Tag ---
  const handleTagChange = async (index: number, newValue: string | Tag | null) => {
    const newTags = [...selectedTags];

    // 1. Clear ค่า
    if (newValue === null) {
        newTags[index] = "";
        setSelectedTags(newTags);
        return;
    }

    // 2. Create New Tag
    if (typeof newValue === 'string' && newValue.startsWith('Add "')) {
        const rawName = newValue.replace('Add "', '').replace('"', '');
        await createNewTagAndSelect(index, rawName, newTags);
    } 
    else if (typeof newValue === 'object' && 'inputValue' in newValue) {
        const rawName = (newValue as any).inputValue;
        await createNewTagAndSelect(index, rawName, newTags);
    }
    // 3. เลือก Tag ปกติ
    else if (typeof newValue === 'object' && 'name' in newValue) {
        newTags[index] = newValue.name;
        setSelectedTags(newTags);
    }
    // 4. พิมพ์เองแล้ว Enter
    else if (typeof newValue === 'string') {
        const existingTag = availableTags.find(t => t.name.toLowerCase() === newValue.toLowerCase());
        if (existingTag) {
            newTags[index] = existingTag.name;
            setSelectedTags(newTags);
        } else {
            await createNewTagAndSelect(index, newValue, newTags);
        }
    }
  };

  // Helper: สร้าง Tag -> เลือก -> Re-fetch All
  const createNewTagAndSelect = async (index: number, tagName: string, currentTags: string[]) => {
      if (!currentUserId) {
          alert("User ID not found. Please refresh the page.");
          return;
      }

      try {
          // 1. สร้าง Tag
          const newTagObj = await TagService.create(tagName, currentUserId);
          
          // 2. เลือก Tag นั้นลงในช่อง input ทันที (เพื่อให้ UI เร็ว)
          currentTags[index] = newTagObj.name;
          setSelectedTags(currentTags);

          // 3. Re-get All Tags (ตาม requirement เพื่อให้ Dropdown ช่องอื่นเห็นด้วย)
          await fetchLatestTags(currentUserId);

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
      if (!currentUserId) throw new Error("User ID missing");

      const validTagNames = selectedTags.filter(tag => tag.trim() !== "");
      const tagIds = validTagNames.map(tagName => {
          const foundTag = availableTags.find(t => t.name === tagName);
          return foundTag ? foundTag.id : null;
      }).filter((id) => id !== null) as number[];

      const newProject = await projectService.create({
        name,
        description,
        user_id: currentUserId, // ใช้ state ที่เก็บไว้ได้เลย ไม่ต้อง await getMe() อีก
        tag_ids: tagIds
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
            
            {/* ถ้า fetchingTags เป็น true (ตอนเข้าหน้าเว็บครั้งแรก) ให้หมุน
               แต่ถ้าเป็นการ fetch ตอนกด dropdown เราจะไม่แสดง loading ทับ input 
               เพื่อให้ UX ลื่นไหล (หรือถ้าชอบแบบหมุนตลอดก็แก้ condition นี้ได้) 
            */}
            {fetchingTags && availableTags.length === 0 ? (
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
                            options={availableTags} 
                            
                            // *** จุดที่เพิ่ม: เมื่อกดเปิด Dropdown ให้ fetch tags ใหม่ ***
                            onOpen={handleDropdownOpen} 
                            
                            value={availableTags.find(t => t.name === tagValue) || tagValue}
                            
                            getOptionLabel={(option) => {
                                if (typeof option === 'string') return option;
                                return option.name;
                            }}

                            onChange={(event, newValue) => {
                                if (typeof newValue === 'object' && newValue !== null && 'name' in newValue && newValue.name === "DELETE_ROW_ACTION") {
                                    handleRemoveTagRow(index);
                                    return;
                                }
                                handleTagChange(index, newValue);
                            }}

                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                const { inputValue } = params;
                                const isExisting = options.some((option) => option.name.toLowerCase() === inputValue.toLowerCase());
                                
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push({
                                        inputValue,
                                        name: `Add "${inputValue}"`,
                                        id: 0 
                                    } as any);
                                }

                                filtered.push({
                                    id: -999,
                                    name: "DELETE_ROW_ACTION" 
                                } as Tag);

                                return filtered;
                            }}

                            renderOption={(props, option) => {
                                const { key, ...otherProps } = props;
                                const optionName = typeof option === 'string' ? option : option.name;

                                if (optionName === "DELETE_ROW_ACTION") {
                                    return (
                                        <li key={key} {...otherProps} style={{ color: '#d32f2f', borderTop: '1px solid #eee' }}>
                                            <DeleteOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
                                            Remove this row
                                        </li>
                                    );
                                }
                                if (optionName.startsWith('Add "')) {
                                    return (
                                        <li key={key} {...otherProps} style={{ color: '#1976d2' }}>
                                            <AddIcon sx={{ mr: 1, fontSize: 20 }} />
                                            {optionName}
                                        </li>
                                    );
                                }
                                return (
                                    <li key={key} {...otherProps}>
                                        <div className="flex justify-between items-center w-full">
                                            <span>{optionName}</span>
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