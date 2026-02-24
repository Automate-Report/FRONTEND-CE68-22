import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/src/services/project.service";

export function useMembers(projectId: number) {
  return useQuery({
    queryKey: ["projects", "user", projectId],
    queryFn: () => projectService.getMember(projectId),
    enabled: !!projectId,
  });
}