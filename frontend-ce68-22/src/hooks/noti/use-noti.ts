import { notiService } from "@/src/services/noti.service";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const LIMIT = 5;

export function useNotifications(isOpen: boolean, isUnread: boolean) {
    const queryClient = useQueryClient();

    const query = useInfiniteQuery({
        // ✅ เพิ่ม isUnread ใน Key เพื่อแยก Cache และกระตุ้นการดึงข้อมูลเมื่อสลับ Tab
        queryKey: ["notifications", isUnread], 
        queryFn: ({ pageParam = 0 }) =>
            notiService.getNoti(pageParam, LIMIT, isUnread),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < LIMIT) return undefined;
            return allPages.length * LIMIT;
        },
        // ✅ ทำงานเฉพาะตอนเปิดหน้าต่าง Noti เท่านั้น
        enabled: isOpen, 
        // ✅ ตั้งค่า StaleTime เป็น 0 เพื่อให้ข้อมูลสดใหม่เสมอเมื่อเปิดขึ้นมา
        staleTime: 0,
    });

    return {
        ...query,
    };
}