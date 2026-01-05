import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/src/services/project.service";

export function useProjects(
  page: number, 
  size: number, 
  sortBy: string | null, 
  sortOrder: "asc" | "desc" | "none", 
  search?: string, // เพิ่ม
  filter?: string  // เพิ่ม
) {
  return useQuery({
    // สำคัญมาก: ต้องใส่ sortBy, sortOrder ใน Key
    queryKey: ['projects', page, size, sortBy, sortOrder, search, filter], 
    
    queryFn: () => projectService.getAll(page, size, sortBy, sortOrder, search, filter),
    
    placeholderData: (previousData) => previousData,
  });
}