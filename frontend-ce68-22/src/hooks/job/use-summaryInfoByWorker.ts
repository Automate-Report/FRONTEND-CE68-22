import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/src/services/job.service";

export function useSummaryInfoByWorker(workerId: number, projectId: number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["jobs", "summary", workerId],
    queryFn: () => jobService.getSummaryInfoByWorker(workerId, projectId),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!workerId, 
  });
}