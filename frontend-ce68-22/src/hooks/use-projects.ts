import { useQuery } from "@tanstack/react-query";
import { projectService } from "../services/project.service";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"], // Key สำหรับ Cache
    queryFn: projectService.getAll,
  });
};