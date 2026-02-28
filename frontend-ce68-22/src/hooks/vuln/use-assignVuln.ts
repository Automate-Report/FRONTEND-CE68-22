import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vulnService } from "@/src/services/vuln.service";
import { toast } from "react-hot-toast";

export function useAssignVuln(vulnId: number, projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { position: string; user_id: string }) =>
      vulnService.assign(projectId, { vuln_id: vulnId, ...payload }),
    onSuccess: () => {
      // ✅ 1. ตรวจสอบชื่อคีย์นี้ให้ตรงกับใน useVuln.ts เป๊ะๆ
      // หากใน useVuln ใช้ ["vuln", vulnId] ให้แก้เป็น "vuln"
      queryClient.invalidateQueries({ 
        queryKey: ["vulns", vulnId, projectId] 
      });

      // ✅ 2. เพิ่มการ Force Refetch เพื่อความมั่นใจ
      queryClient.refetchQueries({
        queryKey: ["vulns", vulnId, projectId]
      });

      toast.success("Assignment updated");
    },
  });
}