import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/src/services/job.service";

export function useSummaryInfoByWorker(workerId: number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["jobs", workerId],
    queryFn: () => jobService.getSummaryInfoByWorker(workerId),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!workerId, 
  });
}