// src/hooks/project/use-changeRole.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/src/services/project.service";
import { toast } from "react-hot-toast";

export function useChangeRole(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { email: string; role: string }) =>
      projectService.changeRole(projectId, payload),
    onSuccess: () => {
      // ✅ สั่งให้ดึงข้อมูล Members ใหม่ทันที
      queryClient.invalidateQueries({ 
        queryKey: ["projects", "user", projectId] 
      });
      toast.success("Member role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update role");
    },
  });
}