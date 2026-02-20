import { useQuery } from "@tanstack/react-query";
import { workerService } from "../../services/worker.service";

export function useWorkerInfoSummary(project_id : number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["workers", project_id],
    queryFn: () => workerService.info(project_id),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!project_id, 
  });
}