import { useQuery } from "@tanstack/react-query";
import { workerService } from "@/src/services/worker.service";

export function useWorkers(
  page: number, 
  size: number, 
  sortBy: string | null, 
  sortOrder: "asc" | "desc" | "none"
) {
  return useQuery({
    // สำคัญมาก: ต้องใส่ sortBy, sortOrder ใน Key
    queryKey: ['workers', page, size, sortBy, sortOrder], 
    
    queryFn: () => workerService.getAll(page, size, sortBy, sortOrder),
    
    placeholderData: (previousData) => previousData,
  });
}