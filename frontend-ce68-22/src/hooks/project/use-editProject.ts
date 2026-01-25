import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { projectService } from "@/src/services/project.service";
import { TagService } from "@/src/services/tag.service";
import { projectTagService } from "@/src/services/project.tag.service";
import { getMe } from "@/src/services/auth.service";
import { Tag } from "@/src/types/tag";

// Interface เดิม
export interface TagRow {
  id: number;
  tagName: string;
}

export const useEditProject = (projectId: number) => { // รับ projectId เข้ามา
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // TagRow state
  const [tagRows, setTagRows] = useState<TagRow[]>([]);
  
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [fetchingData, setFetchingData] = useState(true); // เปลี่ยนชื่อนิดหน่อย
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Tags (เหมือนเดิม)
  const fetchLatestTags = useCallback(async (uid: string) => {
    try {
      const tags = await TagService.getAll(uid);
      setAvailableTags(tags);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // 2. Init Data: ดึง User -> ดึง Tags -> ดึง Project Detail
  useEffect(() => {
    const initData = async () => {
      try {
        setFetchingData(true);
        
        // 2.1 Get User
        const me = await getMe();
        const uid = me["user"];
        if (!uid) throw new Error("User not found");
        setCurrentUserId(uid);

        // 2.2 Get Available Tags (รอให้เสร็จก่อน)
        await fetchLatestTags(uid);

        // 2.3 Get Project Detail (พระเอกของงาน Edit)
        const projectData = await projectService.getById(projectId);

        const tags = await projectTagService.getAll(projectId);
        
        // Set Form Data
        setName(projectData.name);
        setDescription(projectData.description || "");

        // *** แปลง Existing Tags จาก DB ให้เป็น TagRow ***
        // สมมติ projectData.tags เป็น array ของ { id, name }
        if (tags && Array.isArray(tags)) {
            const initialRows: TagRow[] = tags.map((t: any, index: number) => ({
                id: Date.now() + index, // สร้าง ID จำลองสำหรับ UI Key
                tagName: t.name
            }));
            setTagRows(initialRows);
        } else {
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
  }, [projectId, fetchLatestTags]);

  // --- Handlers (เหมือนเดิมเป๊ะ) ---
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
      const newTagObj = await TagService.create(tagName, currentUserId);
      currentRows[index].tagName = newTagObj.name;
      setTagRows(currentRows);
      await fetchLatestTags(currentUserId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTagChange = async (index: number, newValue: string | Tag | null) => {
    const newRows = tagRows.map(row => ({ ...row })); 
    // ... Logic เดิมจาก useCreateProject ...
    if (newValue === null) {
      newRows[index].tagName = "";
      setTagRows(newRows);
    } else if (typeof newValue === 'object' && 'name' in newValue) {
      newRows[index].tagName = newValue.name;
      setTagRows(newRows);
    } else if (typeof newValue === 'string') {
        // ... (ใส่ logic เดิม หรือ copy จาก useCreateProject มาวางตรงนี้ได้เลย)
       const existingTag = availableTags.find(t => t.name.toLowerCase() === newValue.toLowerCase());
       if (existingTag) {
         newRows[index].tagName = existingTag.name;
         setTagRows(newRows);
       } else {
         await createNewTagAndSelect(index, newValue, newRows);
       }
    }
    // ... จัดการกรณี Add New ...
  };
  
  const handleDeleteTagFromDb = async (tagToDelete: Tag) => {
     // ... logic เดิม ...
     // (แต่ต้องระวัง ถ้าลบ Tag ที่ใช้อยู่ในโปรเจกต์นี้ อาจต้องถาม user อีกที)
  }

  // --- Submit Update ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validTagNames = tagRows.map(r => r.tagName).filter(name => name.trim() !== "");
      
      const tagIds = validTagNames.map(tagName => {
        const foundTag = availableTags.find(t => t.name === tagName);
        return foundTag ? foundTag.id : null;
      }).filter((id) => id !== null) as number[];

      // เรียก API Update แทน Create
      await projectService.edit(projectId, {
        name,
        description,
        user_id: currentUserId,
        tag_ids: tagIds
      });

      router.push(`/projects/${projectId}/overview`); // กลับไปหน้า Overview
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
    status: { loading, error, fetchingData },
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