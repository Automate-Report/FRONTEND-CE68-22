import { useQuery } from "@tanstack/react-query";
import { scheduleService } from "@/src/services/schedule.service";

export function useGetJobByScheduleID(id: number) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["schedule", id],
    queryFn: () => scheduleService.getJobByScheduleID(id),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!id, 
  });
}