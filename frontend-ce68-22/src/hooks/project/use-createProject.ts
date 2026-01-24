// src/app/projects/create/hooks/useCreateProject.ts
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { projectService } from "@/src/services/project.service";
import { TagService } from "@/src/services/tag.service";
import { getMe } from "@/src/services/auth.service";
import { Tag } from "@/src/types/tag";

export const useCreateProject = () => {
  const router = useRouter();

  // State Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // State Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([""]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Status State
  const [fetchingTags, setFetchingTags] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- API Actions ---

  const fetchLatestTags = useCallback(async (uid: string) => {
    try {
      const tags = await TagService.getAll(uid);
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
    setSelectedTags([...selectedTags, ""]);
  };

  const handleRemoveTagRow = (index: number) => {
    const newTags = [...selectedTags];
    newTags.splice(index, 1);
    setSelectedTags(newTags);
  };

  const createNewTagAndSelect = async (index: number, tagName: string, currentTags: string[]) => {
    if (!currentUserId) return;
    try {
      const newTagObj = await TagService.create(tagName, currentUserId);
      currentTags[index] = newTagObj.name;
      setSelectedTags(currentTags);
      await fetchLatestTags(currentUserId);
    } catch (err) {
      console.error("Failed to create tag:", err);
      alert("Failed to create new tag.");
    }
  };

  const handleTagChange = async (index: number, newValue: string | Tag | null) => {
    const newTags = [...selectedTags];

    if (newValue === null) {
      newTags[index] = "";
      setSelectedTags(newTags);
    } else if (typeof newValue === 'string' && newValue.startsWith('Add "')) {
      const rawName = newValue.replace('Add "', '').replace('"', '');
      await createNewTagAndSelect(index, rawName, newTags);
    } else if (typeof newValue === 'object' && 'inputValue' in newValue) {
      const rawName = (newValue as any).inputValue;
      await createNewTagAndSelect(index, rawName, newTags);
    } else if (typeof newValue === 'object' && 'name' in newValue) {
      newTags[index] = newValue.name;
      setSelectedTags(newTags);
    } else if (typeof newValue === 'string') {
      const existingTag = availableTags.find(t => t.name.toLowerCase() === newValue.toLowerCase());
      if (existingTag) {
        newTags[index] = existingTag.name;
        setSelectedTags(newTags);
      } else {
        await createNewTagAndSelect(index, newValue, newTags);
      }
    }
  };

  const handleDeleteTagFromDb = async (tagToDelete: Tag) => {
    if (confirm(`Are you sure you want to permanently delete the tag "${tagToDelete.name}"?`)) {
      try {
        await TagService.delete(tagToDelete.id);
        setAvailableTags((prev) => prev.filter((t) => t.id !== tagToDelete.id));
        setSelectedTags((prev) => prev.map((tName) => tName === tagToDelete.name ? "" : tName));
        if (currentUserId) await fetchLatestTags(currentUserId);
      } catch (err) {
        console.error("Failed to delete tag:", err);
        alert("Failed to delete tag.");
      }
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

      const validTagNames = selectedTags.filter(tag => tag.trim() !== "");
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
    formState: { name, description, selectedTags, availableTags },
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