// src/app/projects/create/hooks/useCreateProject.ts
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { projectService } from "@/src/services/project.service";
import { tagService } from "@/src/services/tag.service";
import { getMe } from "@/src/services/auth.service";
import { Tag } from "@/src/types/tag";
import { TagRow } from "@/src/types/tag";

export const useCreateProject = () => {
  const router = useRouter();

  // State Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // State Tags: เปลี่ยนจาก string[] เป็น TagRow[]
  // ใช้ Date.now() เป็น ID เริ่มต้นเพื่อให้ไม่ซ้ำกัน
  const [tagRows, setTagRows] = useState<TagRow[]>([{ id: 1, tagName: "" }]);
  
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Status State
  const [fetchingTags, setFetchingTags] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- API Actions ---

  const fetchLatestTags = useCallback(async (uid: string) => {
    try {
      const tags = await tagService.getAll(uid);
      setAvailableTags(tags);
    } catch (err) {
      console.error("Error fetching tags:", err);
    } finally {
      setFetchingTags(false);
    }
  }, []);

  // Init Data
  useEffect(() => {
    const initData = async () => {
      try {
        setFetchingTags(true);
        const me = await getMe();
        const uid = me["user"];

        if (uid && uid !== "undefined" && uid !== "null") {
          setCurrentUserId(uid);
          setFetchingTags(true);
          await fetchLatestTags(uid);
        }
      } catch (err) {
        console.error("Error init data:", err);
      } finally {
        setFetchingTags(false);
      }
    };
    initData();
  }, [fetchLatestTags]);

  // --- Tag Handlers ---

  const handleDropdownOpen = () => {
    if (currentUserId) fetchLatestTags(currentUserId);
  };

  const handleAddTagRow = () => {
    // เพิ่มแถวใหม่ พร้อม ID ใหม่ (ใช้ Date.now() เพื่อให้ Unique)
    setTagRows([...tagRows, { id: Date.now(), tagName: "" }]);
  };

  const handleRemoveTagRow = (index: number) => {
    const newRows = [...tagRows];
    newRows.splice(index, 1);
    setTagRows(newRows);
  };

  // Helper function สำหรับสร้าง Tag ใหม่
  const createNewTagAndSelect = async (index: number, tagName: string, currentRows: TagRow[]) => {
    if (!currentUserId) return;
    try {
      const newTagObj = await tagService.create(tagName, currentUserId);
      
      // อัปเดต tagName ใน row ที่ระบุ
      currentRows[index].tagName = newTagObj.name;
      setTagRows(currentRows);
      
      await fetchLatestTags(currentUserId);
    } catch (err) {
      console.error("Failed to create tag:", err);
      alert("Failed to create new tag.");
    }
  };

  const handleTagChange = async (index: number, newValue: string | Tag | null) => {
    // Clone array เพื่อป้องกัน mutation โดยตรง
    // เรา copy object ออกมาด้วยเพื่อให้ React detect change ได้ชัวร์ๆ
    const newRows = tagRows.map(row => ({ ...row })); 

    if (newValue === null) {
      newRows[index].tagName = "";
      setTagRows(newRows);
    } 
    else if (typeof newValue === 'string' && newValue.startsWith('Add "')) {
      const rawName = newValue.replace('Add "', '').replace('"', '');
      await createNewTagAndSelect(index, rawName, newRows);
    } 
    else if (typeof newValue === 'object' && 'inputValue' in newValue) {
      const rawName = (newValue as any).inputValue;
      await createNewTagAndSelect(index, rawName, newRows);
    } 
    else if (typeof newValue === 'object' && 'name' in newValue) {
      newRows[index].tagName = newValue.name;
      setTagRows(newRows);
    } 
    else if (typeof newValue === 'string') {
      const existingTag = availableTags.find(t => t.name.toLowerCase() === newValue.toLowerCase());
      if (existingTag) {
        newRows[index].tagName = existingTag.name;
        setTagRows(newRows);
      } else {
        await createNewTagAndSelect(index, newValue, newRows);
      }
    }
  };

  const handleDeleteTagFromDb = async (tagToDelete: Tag) => {
    try {
      await tagService.delete(tagToDelete.id);
        
      // ลบ Tag ออกจาก list available
      setAvailableTags((prev) => prev.filter((t) => t.id !== tagToDelete.id));
        
      // เคลียร์ค่าออกจาก Input ถ้า row ไหนเลือก Tag นี้อยู่
      setTagRows((prev) => prev.map((row) => 
          row.tagName === tagToDelete.name ? { ...row, tagName: "" } : row
      ));

      if (currentUserId) await fetchLatestTags(currentUserId);
    } catch (err) {
      console.error("Failed to delete tag:", err);
      alert("Failed to delete tag.");
    }
  };

  // --- Submit ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!name) throw new Error("Please enter project name");
      if (!currentUserId) throw new Error("User ID missing");

      // ดึงเฉพาะชื่อ tag ออกมาจาก row object
      const validTagNames = tagRows
        .map(row => row.tagName)
        .filter(tagName => tagName.trim() !== "");

      // แปลงชื่อเป็น ID
      const tagIds = validTagNames.map(tagName => {
        const foundTag = availableTags.find(t => t.name === tagName);
        return foundTag ? foundTag.id : null;
      }).filter((id) => id !== null) as number[];

      const newProject = await projectService.create({
        name,
        description,
        user_id: currentUserId,
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

  return {
    formState: { name, description, tagRows, availableTags },
    setters: { setName, setDescription },
    status: { loading, error, fetchingTags },
    handlers: {
      handleAddTagRow,
      handleRemoveTagRow,
      handleTagChange,
      handleDeleteTagFromDb,
      handleDropdownOpen,
      handleSubmit
    },
    router
  };
};