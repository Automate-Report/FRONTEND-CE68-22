import { useQuery } from "@tanstack/react-query";
import { tagService } from "@/src/services/tag.service";

export function useProjectsTag(
  projectId: number
) {
  return useQuery({
    // สำคัญมาก: ต้องใส่ sortBy, sortOrder ใน Key
    queryKey: ['tags', projectId], 
    
    queryFn: () => tagService.getAllProjectId(projectId),
    
    placeholderData: (previousData) => previousData,
  });
}