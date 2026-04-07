import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { projectService } from "@/src/services/project.service";
import { tagService } from "@/src/services/tag.service";

import { Tag } from "@/src/types/tag";
import { TagRow } from "@/src/types/tag";
import { showToast } from "@/src/components/Common/ToastContainer";
import { Close } from "@mui/icons-material";

// รับ projectId เข้ามาเพื่อดึงข้อมูล
export const useEditProject = (projectId: number) => {
  const router = useRouter();

  // State Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // State Tags
  const [tagRows, setTagRows] = useState<TagRow[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  // Status State
  const [fetchingData, setFetchingData] = useState(true); // ใช้ตัวเดียวคุมการโหลดตอนแรก
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Fetch Master Data ---
  const fetchLatestTags = useCallback(async () => {
    try {
      const tags = await tagService.getAll();
      setAvailableTags(tags);
    } catch (err) {
      // handle if needed
    } finally {
    }
  }, []);

  // --- 2. Init Data (ดึง Project เก่ามาใส่ Form) ---
  useEffect(() => {
    const initData = async () => {
      try {
        setFetchingData(true);

        // รอโหลด Tags และ Project Data ให้เสร็จพร้อมกัน
        const [tagsData, projectData, selectedTag] = await Promise.all([
          tagService.getAll(),
          projectService.getById(projectId),
          tagService.getAllProjectId(projectId)
        ]);

        setAvailableTags(tagsData);

        // Set Form Data
        setName(projectData.name);
        setDescription(projectData.description || "");

        // *** หัวใจสำคัญ: แปลง Tags จาก DB ให้กลายเป็น TagRow สำหรับ UI ***
        // เราใช้ Date.now() + index เพื่อสร้าง ID ชั่วคราวให้ UI Key ไม่ซ้ำกัน
        if (selectedTag && selectedTag.length > 0) {
          const initialRows = selectedTag.map((t: Tag, index: number) => ({
            id: Date.now() + index,
            tagName: t.name
          }));
          setTagRows(initialRows);
        } else {
          // ถ้าไม่มี Tag เลย ให้สร้างแถวเปล่า 1 อัน
          setTagRows([{ id: Date.now(), tagName: "" }]);
        }

      } catch (err: any) {
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
    fetchLatestTags();
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
    try {
      const newTagObj = await tagService.create(tagName);
      currentRows[index].tagName = newTagObj.name;
      setTagRows(currentRows);
      await fetchLatestTags();
    } catch (err) {
      showToast({
        icon: <Close sx={{ fontSize: "20px", color: "#FE3B46" }} />,
        message: "Failed to create tag :(",
        borderColor: "#FE3B46",
        duration: 6000,
      });
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
      await fetchLatestTags();
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