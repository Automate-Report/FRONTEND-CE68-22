import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vulnService } from "@/src/services/vuln.service";
import { toast } from "react-hot-toast";

export function useUpdateStatus(vulnId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newStatus: string) => vulnService.changeStatus(vulnId, newStatus),
    onSuccess: () => {
      // ✅ ล้างแคชเพื่อให้ UI โหลดข้อมูลล่าสุดมาแสดงผล
      queryClient.invalidateQueries({ queryKey: ["vulns", vulnId] });
      toast.success("Vulnerability status updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });
}