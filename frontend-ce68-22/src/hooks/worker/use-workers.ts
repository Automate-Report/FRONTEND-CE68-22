import { useQuery } from "@tanstack/react-query";
import { workerService } from "@/src/services/worker.service";

export function useWorkers(
  projectId: number,
  page: number, 
  size: number, 
  sortBy: string | null, 
  sortOrder: "asc" | "desc" | "none",
  search?: string, // เพิ่ม
  filter?: string  // เพิ่ม
) {
  return useQuery({
    // สำคัญมาก: ต้องใส่ sortBy, sortOrder ใน Key
    queryKey: ['workers', projectId, page, size, sortBy, sortOrder, search, filter], 
    
    queryFn: () => workerService.getAll(projectId, page, size, sortBy, sortOrder, search, filter),
    
    placeholderData: (previousData) => previousData,
  });
}