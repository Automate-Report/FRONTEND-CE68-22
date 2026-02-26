import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/src/services/project.service"; // ตรวจสอบ path service ของคุณ
import { ProjectOverviewResponse } from "@/src/types/project"; // ตรวจสอบ path type ของคุณ

/**
 * Hook สำหรับดึงข้อมูลภาพรวมของโปรเจกต์ (Dashboard Data)
 * @param projectId ID ของโปรเจกต์
 */
export function useProjectOverview(projectId: number) {
  return useQuery<ProjectOverviewResponse>({
    // ✅ กำหนด Unique Key ให้กับ Cache
    queryKey: ["project-overview", projectId],
    
    // ✅ เรียกใช้ Service ที่คุณเขียนไว้
    queryFn: () => projectService.getOverview(projectId),
    
    // ✅ ป้องกันการดึงข้อมูลบ่อยเกินไป (ตั้งค่าให้ข้อมูล "สด" นานขึ้นนิดหน่อยในหน้า Dashboard)
    staleTime: 1000 * 60 * 5, // 5 นาที
    
    // ✅ ดึงข้อมูลใหม่เมื่อมีการกลับมาที่หน้าต่างนี้ (Window Focus)
    refetchOnWindowFocus: true,

    // ✅ กรณีที่ projectId ไม่ถูกต้อง จะไม่ทำการยิง API
    enabled: !!projectId && !isNaN(projectId),
  });
}