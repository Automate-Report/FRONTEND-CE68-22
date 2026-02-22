import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/src/services/job.service";

export function useGetJobByWorker(workerId: number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["jobs", "worker", workerId],
    queryFn: () => jobService.getJobByWorker(workerId),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!workerId, 
  });
}