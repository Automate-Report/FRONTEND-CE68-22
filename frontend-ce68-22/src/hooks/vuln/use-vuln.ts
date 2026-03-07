import { useQuery } from "@tanstack/react-query";
import { vulnService } from "@/src/services/vuln.service";

export function useVuln(vulnId: number, projectId: number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["vulns", vulnId, projectId],
    queryFn: () => vulnService.getById(vulnId, projectId),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!vulnId && !!projectId, 
  });
}