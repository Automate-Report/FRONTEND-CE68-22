import { useQuery } from "@tanstack/react-query";
import { scheduleService } from "@/src/services/schedule.service";

export function useSchedule(
    page: number,
    size: number,
    sortBy: string | null,
    sortOrder: "asc" | "desc" | "none",
    search?: string, // เพิ่ม
    filter?: string  // เพิ่ม
) {
    return useQuery({
        // สำคัญมาก: ต้องใส่ sortBy, sortOrder ใน Key
        queryKey: ['schedules', page, size, sortBy, sortOrder, search, filter],

        queryFn: () => scheduleService.getAll(page, size, sortBy, sortOrder, search, filter),

        placeholderData: (previousData) => previousData,
    });
}