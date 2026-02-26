export type NotificationType = "report" | "schedule_start" | "schedule_stop" | "error";

export type NotificationStatus = "unread" | "read";

export interface Notification {
    noti_id: number;
    user_email: string;
    type: NotificationType;
    message: string;
    hyperlink: string;
    created_at: string;
    status: NotificationStatus;
}