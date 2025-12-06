import { useQuery } from "@tanstack/react-query";
import { projectService } from "../services/project.service";

export function useProjects(
  page: number, 
  size: number, 
  sortBy: string | null, 
  sortOrder: "asc" | "desc" | "none"
) {
  return useQuery({
    // สำคัญมาก: ต้องใส่ sortBy, sortOrder ใน Key
    queryKey: ["projects", page, size, sortBy, sortOrder], 
    
    queryFn: () => projectService.getAll(page, size, sortBy, sortOrder),
    
    placeholderData: (previousData) => previousData,
  });
}