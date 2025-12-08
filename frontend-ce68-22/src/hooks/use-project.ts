import { useQuery } from "@tanstack/react-query";
import { projectService } from "../services/project.service";
// import { Project } from "../types/project";

export function useProject(id: number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["project", id],
    queryFn: () => projectService.getById(id),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!id, 
  });
}