import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { projectService } from "@/src/services/project.service";
import { tagService } from "@/src/services/tag.service";
import { getMe } from "@/src/services/auth.service";
import { Tag } from "@/src/types/tag";
import { TagRow } from "@/src/types/tag";

// รับ projectId เข้ามาเพื่อดึงข้อมูล
export const useEditProject = (projectId: number) => {
  const router = useRouter();

  // State Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // State Tags
  const [tagRows, setTagRows] = useState<TagRow[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Status State
  const [fetchingData, setFetchingData] = useState(true); // ใช้ตัวเดียวคุมการโหลดตอนแรก
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Fetch Master Data ---
  const fetchLatestTags = useCallback(async (uid: string) => {
    try {
      const tags = await tagService.getAll(uid);
      setAvailableTags(tags);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  }, []);

  // --- 2. Init Data (ดึง Project เก่ามาใส่ Form) ---
  useEffect(() => {
    const initData = async () => {
      try {
        setFetchingData(true);
        const me = await getMe();
        const uid = me["user"];

        if (!uid) throw new Error("User ID not found");
        setCurrentUserId(uid);

        // รอโหลด Tags และ Project Data ให้เสร็จพร้อมกัน
        const [tagsData, projectData] = await Promise.all([
           tagService.getAll(uid),
           projectService.getById(projectId)
        ]);

        setAvailableTags(tagsData);

        // Set Form Data
        setName(projectData.name);
        setDescription(projectData.description || "");

        // *** หัวใจสำคัญ: แปลง Tags จาก DB ให้กลายเป็น TagRow สำหรับ UI ***
        // เราใช้ Date.now() + index เพื่อสร้าง ID ชั่วคราวให้ UI Key ไม่ซ้ำกัน
        if (tagsData && tagsData.length > 0) {
            const initialRows = tagsData.map((t: Tag, index: number) => ({
                id: Date.now() + index, 
                tagName: t.name
            }));
            setTagRows(initialRows);
        } else {
            // ถ้าไม่มี Tag เลย ให้สร้างแถวเปล่า 1 อัน
            setTagRows([{ id: Date.now(), tagName: "" }]);
        }

      } catch (err: any) {
        console.error("Error init data:", err);
        setError("Failed to load project data");
      } finally {
        setFetchingData(false);
      }
    };

    if (projectId) {
        initData();
    }
  }, [projectId]); // run เมื่อ projectId เปลี่ยน

  // --- Tag Handlers (เหมือน Create เป๊ะ) ---

  const handleDropdownOpen = () => {
    if (currentUserId) fetchLatestTags(currentUserId);
  };

  const handleAddTagRow = () => {
    setTagRows([...tagRows, { id: Date.now(), tagName: "" }]);
  };

  const handleRemoveTagRow = (index: number) => {
    const newRows = [...tagRows];
    newRows.splice(index, 1);
    setTagRows(newRows);
  };

  const createNewTagAndSelect = async (index: number, tagName: string, currentRows: TagRow[]) => {
    if (!currentUserId) return;
    try {
      const newTagObj = await tagService.create(tagName, currentUserId);
      currentRows[index].tagName = newTagObj.name;
      setTagRows(currentRows);
      await fetchLatestTags(currentUserId);
    } catch (err) {
      console.error(err);
      alert("Failed to create new tag.");
    }
  };

  const handleTagChange = async (index: number, newValue: string | Tag | null) => {
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
      // 1. ลบจาก DB ทันที
      await tagService.delete(tagToDelete.id);
      
      // 2. เอาออกจาก list available
      setAvailableTags((prev) => prev.filter((t) => t.id !== tagToDelete.id));
      
      // 3. เคลียร์ออกจาก Input (ถ้าเลือกอยู่)
      setTagRows((prev) => prev.map((row) => 
          row.tagName === tagToDelete.name ? { ...row, tagName: "" } : row
      ));
      
      // 4. (Optional) Fetch ใหม่ถ้าต้องการความชัวร์
      if (currentUserId) await fetchLatestTags(currentUserId);
    } catch (err) {
      console.error("Failed to delete tag:", err);
      alert("Failed to delete tag.");
    }
  };

  // --- Submit Update (ต่างจาก Create ตรงนี้) ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {

      if (!currentUserId) {
        throw new Error("User session not found. Please login again.");
      }
      // 1. เตรียม ID
      const validTagNames = tagRows
        .map(row => row.tagName)
        .filter(tagName => tagName && tagName.trim() !== "");

      const tagIds = validTagNames.map(tagName => {
        const foundTag = availableTags.find(t => t.name === tagName);
        return foundTag ? foundTag.id : null;
      }).filter((id) => id !== null) as number[];

      // 2. เรียก API Update (PUT)
      // ส่ง ID ทั้งหมดที่มีไป Backend จะทำการ Sync (แทนที่ของเดิม) ให้เอง
      await projectService.edit(projectId, {
        name,
        description,
        user_id: currentUserId,
        tag_ids: tagIds 
      });

      // 3. กลับไปหน้า Overview
      router.push(`/projects/${projectId}/overview`);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return {
    formState: { name, description, tagRows, availableTags },
    setters: { setName, setDescription },
    status: { loading, error, fetchingData }, // ส่ง fetchingData ออกไปใช้ตอน Loading หน้าแรก
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