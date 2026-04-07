import { useQuery, keepPreviousData } from "@tanstack/react-query"; // ✅ Import keepPreviousData
import { projectService } from "@/src/services/project.service";

export function useMembers(
  projectId: number,
  page: number, 
  size: number, 
  sortBy: string | null, 
  sortOrder: "asc" | "desc" | "none", 
  search?: string,
  filter?: string
) {
  return useQuery({
    queryKey: ["projects", projectId, "members", page, size, sortBy, sortOrder, search, filter],
    queryFn: () => projectService.getMember(projectId, page, size, sortBy, sortOrder, search, filter),
    enabled: !!projectId,
    placeholderData: keepPreviousData, // ✅ เพิ่มบรรทัดนี้เพื่อป้องกันการกระพริบหน้าขาว
    staleTime: 1000, // (Optional) ช่วยให้ข้อมูลไม่ fetch บ่อยเกินไปในระยะเวลาสั้นๆ
  });
}