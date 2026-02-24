import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/src/services/project.service";

export function useMembers(
  projectId: number,
  page: number, 
  size: number, 
  sortBy: string | null, 
  sortOrder: "asc" | "desc" | "none", 
  search?: string, // เพิ่ม
  filter?: string
) {
  return useQuery({
    queryKey: ["projects", "user", projectId, page, size, sortBy, sortOrder, search, filter],
    queryFn: () => projectService.getMember(projectId, page, size, sortBy, sortOrder, search, filter),
    enabled: !!projectId,
  });
}