import { useQuery } from "@tanstack/react-query";
import { assetService } from "../../services/asset.service";

export function useGetAllAssetNames(projectId: number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["asset", projectId],
    queryFn: () => assetService.getAllNameAndId(projectId), // รอกลับมาทำ
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!projectId, 
  });
}