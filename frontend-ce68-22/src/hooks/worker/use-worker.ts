import { useQuery } from "@tanstack/react-query";
import { workerService } from "../../services/worker.service";

export function useWorker(id: number, projectId: number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["workers", id, projectId],
    queryFn: () => workerService.getById(id, projectId),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!id, 
  });
}