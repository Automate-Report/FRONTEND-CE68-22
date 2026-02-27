import { Divider } from "@mui/material";

import EditIcon from "../icon/Edit";
import DeleteProjectIcon from "../icon/Delete";
import NetworkIcon from "../icon/NetworkIcon";
import { ScheduleDelete, ScheduleDisplay } from "@/src/types/schedule";
import { getDisplayDate } from "../Common/GetDisplayDate";
import Link from "next/link";

interface ScheduleCardProps {
    schedule: ScheduleDisplay,
    onDelete: (schedule: ScheduleDelete) => void
}

export function ScheduleCard({ schedule, onDelete }: ScheduleCardProps) {
    return (
        <div className="flex flex-col items-center rounded-xl border border-[rgba(64,79,87,0.4)] w-full 
        transition-transform duration-200 hover:border-[#8FFF9C] hover:-translate-y-1 cursor-pointer">
            <div className="w-full py-4 px-5 bg-[#1A2025] rounded-t-xl">
                <div className="flex flex-row items-center gap-6 justify-between w-full">
                    <div className="flex flex-col w-[60%]">
                        <h3 className="font-semibold text-xl pb-2 truncate">{schedule.name}</h3>
                        <div className="flex flex-row gap-2 items-center text-[#8FFF9C]">
                            <NetworkIcon />
                            <p className="font-light text-sm truncate">{schedule.asset_name}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href={`/projects/${schedule.project_id}/schedule/${schedule.id}/edit`} className="cursor-pointer">
                            <div className="flex items-center justify-center w-12 h-12 border border-[rgba(64,79,87,0.4)] 
                            rounded-xl hover:text-[#8FFF9C] hover:bg-[rgba(143,255,156,0.1)]"
                            onClick={(e) => {e.stopPropagation();}}> <EditIcon /></div>
                </Link>
                <div className="flex items-center justify-center w-12 h-12 border border-[rgba(64,79,87,0.4)] rounded-xl hover:text-[#FF3B30] hover:bg-[rgba(255,59,48,0.1)]"
                    onClick={(e) => { e.stopPropagation(); onDelete(schedule); }}><DeleteProjectIcon /></div>
            </div>
        </div>
            </div >
            <Divider sx={{ borderColor: "#404F57", width: "100%" }} />
            <div className="w-full py-4 px-5 bg-[#151b1d] rounded-b-xl">
                <div className="flex flex-col w-full gap-4">
                    <div className="flex flex-row gap-6 justify-between items-center w-full">
                        <h3 className="font-md text-md text-[#9AA6A8]">Status Breakdown</h3>
                        <div className="font-semibold text-sm text-[#8FFF9C] border border-[rgba(143, 255, 156, 0.3)] bg-[#8FFF9C]/10 
                        rounded-xl px-4 py-1">
                            {schedule.job_status.finished + schedule.job_status.failed
                                + schedule.job_status.ongoing + schedule.job_status.scheduled} Total jobs
                        </div>
                    </div>
                    {/* V.Colorful */}
                    <div className="grid grid-cols-4 w-full gap-4">
                        <div className="flex flex-col items-center justify-center w-full h-18 bg-[#192024] text-[#8FFF9C] rounded-xl gap-1">
                            <p className="text-sm">Finished</p>
                            <span className="font-bold text-2xl"> {schedule.job_status.finished} </span>
                        </div>
                        <div className="flex flex-col items-center justify-center w-full h-18 bg-[#192024] text-[#DD6E6E] rounded-xl gap-1">
                            <p className="text-sm">Failed</p>
                            <span className="font-bold text-2xl"> {schedule.job_status.failed} </span>
                        </div>
                        <div className="flex flex-col items-center justify-center w-full h-18 bg-[#192024] text-[#DDA96E] rounded-xl gap-1">
                            <p className="text-sm">Ongoing</p>
                            <span className="font-bold text-2xl"> {schedule.job_status.ongoing} </span>
                        </div>
                        <div className="flex flex-col items-center justify-center w-full h-18 bg-[#192024] text-[#6E9ADD] rounded-xl gap-1">
                            <p className="text-sm">Scheduled</p>
                            <span className="font-bold text-2xl"> {schedule.job_status.scheduled} </span>
                        </div>
                    </div>

                    <Divider sx={{ borderColor: "#404F57", width: "100%" }} />
                    <div className="flex flex-row gap-6 justify-between items-center w-full text-[#9AA6A8]">
                        <h3 className="font-light text-md"><span className="font-bold">Start: </span>{getDisplayDate(new Date(schedule.start_date))}</h3>
                        <h3 className="font-light text-md"><span className="font-bold">End: </span>{getDisplayDate(new Date(schedule.end_date))}</h3>
                    </div>
                </div>
            </div>
        </div >
    );
}