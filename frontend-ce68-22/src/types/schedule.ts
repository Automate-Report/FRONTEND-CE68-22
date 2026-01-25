interface JobStatus {
    failed: number,
    finished: number,
    ongoing: number,
    scheduled: number
}

export interface ScheduleDisplay {
    id: number,
    project_id: number,
    name: string,
    job_status: JobStatus,
    atk_type: string,
    start_date: Date,
    end_date: Date
}

export interface ScheduleCreatePayload {
    project_id: number,
    name: string,
    atk_type: string,
    asset: number, //จะให้ Front ส่งเป็น ID มาเลย
    worker: number, //จะให้ Front ส่งเป็น ID มาเลย
    cron_expression: string, //เช่น "0 0 * * *" (ทำที่ Front)
    start_date: Date,
    end_date: Date | null //ถ้าไม่ตั้ง Repeat จะไม่มีค่า end_date
}

export interface ScheduleDelete {
    id: number,
    name: string;
}