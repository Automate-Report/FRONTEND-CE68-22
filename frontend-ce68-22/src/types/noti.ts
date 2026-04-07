export type NotificationType = "info" | "success" | "warning" | "error";

export type NotificationStatus = "unread" | "read";

export interface Notification {
    id: number;
    user_email: string;
    type: NotificationType;
    message: string;
    hyperlink: string;
    created_at: string;
    status: NotificationStatus;
} 