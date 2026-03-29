import { useQuery } from "@tanstack/react-query";
import { userService } from "@/src/services/user.service";

export function useGetUserProfileDisplay() {
    return useQuery({
        // Key ต้องมี ID เพื่อให้แยก cache ของแต่ละโปรเจกต์
        queryKey: ["user"],
        queryFn: () => userService.getProfile(),

    });
}