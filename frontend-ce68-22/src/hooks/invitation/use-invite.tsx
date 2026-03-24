import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { inviteService } from "@/src/services/invite.service";
import { showToast } from "@/src/components/Common/ToastContainer";
import { Close } from "@mui/icons-material";

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
            showToast({
                icon: <Close sx={{ fontSize: "20px", color: "#FE3B46" }} />,
                message: error?.response?.data?.detail || "Failed to accept the invitation. Please try again.",
                borderColor: "#FE3B46",
                duration: 6000,
            });
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