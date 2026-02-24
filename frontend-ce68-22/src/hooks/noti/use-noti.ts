import { notiService } from "@/src/services/noti.service";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const LIMIT = 5;

export function useNotifications(isOpen: boolean, isUnread: boolean) {
    const queryClient = useQueryClient();

    const query = useInfiniteQuery({
        queryKey: ["notifications"],
        queryFn: ({ pageParam = 0 }) =>
            notiService.getNoti(pageParam, LIMIT, isUnread),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            // If backend returns less than limit = stop
            if (lastPage.length < LIMIT) return undefined;

            return allPages.length * LIMIT;
        },

        enabled: isOpen,
    });

    const resetNotifications = () => {
        queryClient.removeQueries({ queryKey: ["notifications"] });
    };

    return {
        ...query,
        resetNotifications,
    };
}