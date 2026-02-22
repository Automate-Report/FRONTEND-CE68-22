import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/src/services/job.service";

export function useGetJobByWorker(
  workerId: number,
  page: number, 
  size: number, 
  sortBy: string | null, 
  sortOrder: "asc" | "desc" | "none",
  search?: string, // เพิ่ม
  filter?: string
) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["jobs", "worker", workerId, page, size, sortBy, sortOrder, search, filter],
    queryFn: () => jobService.getJobByWorker(workerId, page, size, sortBy, sortOrder, search, filter),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!workerId, 
  });
}