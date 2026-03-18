import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { inviteService } from "@/src/services/invite.service";

export function useInvitations() {
    return useQuery({
        queryKey: ["invitations"],
        queryFn: () => inviteService.getInvitations(),
    });
}

export function useAcceptInvitation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (projectId: number) => inviteService.acceptInvitation(projectId),
        onSuccess: (data) => {
            // Show success message if backend returns one
            if (data?.detail) {
                console.log('Success:', data.detail);
                // You can use toast notifications here
            }
            queryClient.invalidateQueries({ queryKey: ["invitations"] });
        },
        onError: (error: any) => {
            console.error('Accept invitation failed:', error?.response?.data?.detail || error.message);
            // Handle error - show toast, etc.
        },
    });
}

export function useDeclineInvitation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (projectId: number) => inviteService.declineInvitation(projectId),
        onSuccess: (data) => {
            // Show success message if backend returns one
            if (data?.detail) {
                console.log('Success:', data.detail);
                // You can use toast notifications here
            }
            queryClient.invalidateQueries({ queryKey: ["invitations"] });
        },
        onError: (error: any) => {
            console.error('Decline invitation failed:', error?.response?.data?.detail || error.message);
            // Handle error - show toast, etc.
        },
    });
}