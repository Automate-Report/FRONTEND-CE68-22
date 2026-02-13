import { useQuery } from "@tanstack/react-query";
import { scheduleService } from "@/src/services/schedule.service";

export function useGetJobByScheduleID(
    schedule_id: number,
    page: number,
    size: number,
    sortBy: string | null,
    sortOrder: "asc" | "desc" | "none"
) {
    return useQuery({
        queryKey: ['jobs', schedule_id, page, size, sortBy, sortOrder],

        queryFn: () => scheduleService.getJobByScheduleID(schedule_id, page, size, sortBy, sortOrder),

        placeholderData: (previousData) => previousData,
    });
}