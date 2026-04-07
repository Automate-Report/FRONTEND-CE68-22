import { useQuery } from "@tanstack/react-query";
import { scheduleService } from "@/src/services/schedule.service";

export function useGetJobByScheduleID(
    projectId: number,
    schedule_id: number,
    page: number,
    size: number,
    sortBy: string | null,
    sortOrder: "asc" | "desc" | "none"
) {
    return useQuery({
        queryKey: ['jobs', projectId, schedule_id, page, size, sortBy, sortOrder],

        queryFn: () => scheduleService.getJobByScheduleID(projectId, schedule_id, page, size, sortBy, sortOrder),

        placeholderData: (previousData) => previousData,
    });
}