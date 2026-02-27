import { useQuery } from "@tanstack/react-query";
import { scheduleService } from "@/src/services/schedule.service";

export function useSchedule(
    project_id: number,
    page: number,
    size: number,
    search?: string, // เพิ่ม
    filter?: string  // เพิ่ม
) {
    return useQuery({
        queryKey: ['schedules', project_id, page, size, search, filter],

        queryFn: () => scheduleService.getAll(project_id, page, size, search, filter),

        placeholderData: (previousData) => previousData,
    });
}