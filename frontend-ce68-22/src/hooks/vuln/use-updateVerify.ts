import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vulnService } from "@/src/services/vuln.service";
import { toast } from "react-hot-toast";

export function useUpdateVerify(vulnId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newVerify: string) => vulnService.changeVerify(vulnId, newVerify),
    onSuccess: () => {
      // ✅ Refresh ข้อมูลเพื่อให้ Chip/Select และสถานะอื่นๆ อัปเดต
      queryClient.invalidateQueries({ queryKey: ["vulns", vulnId] });
      toast.success("Verification status updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update verification");
    },
  });
}