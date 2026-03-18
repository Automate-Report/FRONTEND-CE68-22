import { useQuery } from "@tanstack/react-query";
import { inviteService } from "@/src/services/invite.service";

export function useInvitations() {
    return useQuery({
        queryKey: ["invitations"],
        queryFn: () => inviteService.getInvitations(),
    });
}