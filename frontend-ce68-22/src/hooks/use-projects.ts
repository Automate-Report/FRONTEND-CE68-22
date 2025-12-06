import { useQuery } from "@tanstack/react-query";
import { projectService } from "../services/project.service";

export function useProjects(page: number, size: number) {
  return useQuery({
    // key ต้องเปลี่ยนตาม page เพื่อให้มัน fetch ใหม่เมื่อเปลี่ยนหน้า
    queryKey: ["projects", page, size], 
    queryFn: () => projectService.getAll(page, size),
    // keepPreviousData: true, // (Optional) ช่วยให้ UI ไม่กระพริบตอนเปลี่ยนหน้า
    placeholderData: (previousData) => previousData,
    
  });
}