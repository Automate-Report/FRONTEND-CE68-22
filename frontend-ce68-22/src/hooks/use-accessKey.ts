import { useQuery } from "@tanstack/react-query";
import { accessKeyService } from "../services/accessKey.service";
import { AccessKey } from "../types/access_key";

export function useAccessKey(id: number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["access-keys", id],
    queryFn: () => accessKeyService.getById(id),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!id, 
  });
}

export function useAccessKeyByWorker(workerId?: number | null) {
  
  // 2. ระบุ Generic Type <AccessKey | null>
  return useQuery<AccessKey | null>({
    queryKey: ["access-keys", "worker", workerId],
    
    queryFn: () => {
      // ถ้า workerId เป็น null/undefined ให้ส่ง null กลับไปเลย (ไม่เรียก API)
      if (!workerId) return null;
      return accessKeyService.getByWorkerId(workerId);
    },
    
    // 3. enabled: จะทำงานก็ต่อเมื่อ workerId มีค่าเป็นตัวเลขจริงๆ
    enabled: !!workerId && !isNaN(workerId),
    
    // retry: false, // แนะนำ: ปิด retry เพื่อไม่ให้ยิงซ้ำถ้าไม่เจอข้อมูล
  });
}