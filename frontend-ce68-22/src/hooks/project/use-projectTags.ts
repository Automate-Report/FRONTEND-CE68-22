import { useQuery } from "@tanstack/react-query";
import { projectTagService } from "@/src/services/project.tag.service"; 

export function useTagProjects(
  projectId: number
) {
  return useQuery({
    // สำคัญมาก: ต้องใส่ sortBy, sortOrder ใน Key
    queryKey: ['project-tags', projectId], 
    
    queryFn: () => projectTagService.getAll(projectId),
    
    placeholderData: (previousData) => previousData,
  });
}