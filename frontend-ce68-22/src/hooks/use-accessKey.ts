import { useQuery } from "@tanstack/react-query";
import { accessKeyService } from "../services/accessKey.service";

export function useAccessKey(id: number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["worker", id],
    queryFn: () => accessKeyService.getById(id),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!id, 
  });
}