import { useQuery } from "@tanstack/react-query";
import { vulnService } from "@/src/services/vuln.service";

export function useVuln(
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
    queryKey: ['vulns', 'all', projectId, page, size, sortBy, sortOrder, search, filter], 
    
    queryFn: () => vulnService.getAll(projectId, page, size, sortBy, sortOrder, search, filter),
    
    placeholderData: (previousData) => previousData,
  });
}