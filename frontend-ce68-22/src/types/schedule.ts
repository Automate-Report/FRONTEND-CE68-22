interface JobStatus {
    failed: number,
    finished: number,
    ongoing: number,
    scheduled: number
}

export interface JobDisplay {
    id: number,
    name: string,
    worker_id: number,
    worker_name: string,
    status: string,
    created_at: Date
}
export interface ScheduleDisplay {
    id: number,
    project_id: number,
    name: string,
    asset_name: string,
    atk_type: string,
    start_date: Date,
    end_date: Date
    job_status: JobStatus,
}
export interface ScheduleItem {
    schedule_id: number;
    schedule_name: string;
    project_id: number;
    asset_id: number;
    cron_expression: string;
    attack_type: string; 
    is_active: boolean;
    next_run_at: Date; 
    start_date: Date; 
    end_date: Date;    
    created_at: Date;  
    updated_at: Date; 
};

export interface ScheduleCreatePayload {
    project_id: number,
    name: string,
    atk_type: string,
    asset: number, //จะให้ Front ส่งเป็น ID มาเลย
    cron_expression: string, //เช่น "0 0 * * *" (ทำที่ Front)
    start_date: string,
    end_date: string //ถ้าไม่ตั้ง Repeat end_date = start_date
}

export interface ScheduleDelete {
    id: number,
    name: string;
}