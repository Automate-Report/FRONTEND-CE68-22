import { useQuery } from "@tanstack/react-query";
import { getUsername } from "@/src/services/auth.service";

export function useUsername(userId: string) {
  return useQuery({
    // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
    queryKey: ["auth", "username", userId],
    queryFn: () => getUsername(userId),
    
    // enabled: !!id คือถ้าไม่มี id (เช่นเป็น null/0) จะไม่ยิง API
    enabled: !!userId, 
  });
}