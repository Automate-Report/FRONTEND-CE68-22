import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/src/services/auth.service";
export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 60, // ข้อมูลตัวเองไม่เปลี่ยนบ่อย เก็บไว้ได้ 1 ชม.
  });
}