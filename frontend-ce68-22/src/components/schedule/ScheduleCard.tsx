import { Divider } from "@mui/material";

import EditIcon from "../icon/Edit";
import DeleteProjectIcon from "../icon/Delete";

export function ScheduleCard() {
    return (
        <div className="flex flex-col gap-4 items-center bg-[#1A2025] py-4 px-5 rounded-xl border border-[rgba(64,79,87,0.4)] w-full">
            <div className="flex flex-row gap-6 justify-between w-full">
                <div className="flex flex-col">
                    <h3 className="font-semibold text-xl">Schedule Name</h3>
                    <p className="font-light text-sm">Asset name</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-center w-12 h-12 border border-[rgba(64,79,87,0.4)] rounded-xl hover:text-[#8FFF9C] hover:bg-[rgba(143,255,156,0.1)]" 
                    onClick={() => (alert("edit clicked"))}><EditIcon /></div>
                    <div className="flex items-center justify-center w-12 h-12 border border-[rgba(64,79,87,0.4)] rounded-xl hover:text-[#FF3B30] hover:bg-[rgba(255,59,48,0.1)]" 
                    onClick={() => (alert("delete clicked"))}><DeleteProjectIcon /></div>
                </div>
            </div>
            <Divider sx={{ borderColor: "#404F57", width: "100%" }} />
            <div className="flex flex-col w-full gap-4">
                <div className="flex flex-row gap-6 justify-between items-center w-full">
                    <h3 className="font-md text-md">Status Breakdown</h3>
                    <div className="font-semibold text-sm border border-[rgba(64,79,87,0.4)] rounded-xl px-4 py-1">5 Total jobs</div>
                </div>
                <div className="grid grid-cols-4 w-full gap-4">
                    <div className="flex flex-col items-center justify-center w-full h-18 bg-[#DEFFE2] text-[#3E935E] rounded-xl gap-1">
                        <p className="text-sm">Finished</p>
                        <span className="font-bold text-2xl"> 3 </span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full h-18 bg-[#FFDEDE] text-[#DD6E6E] rounded-xl gap-1">
                        <p className="text-sm">Failed</p>
                        <span className="font-bold text-2xl"> 1 </span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full h-18 bg-[#FDFFDE] text-[#DDA96E] rounded-xl gap-1">
                        <p className="text-sm">Ongoing</p>
                        <span className="font-bold text-2xl"> 1 </span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full h-18 bg-[#DEFFFD] text-[#6E9ADD] rounded-xl gap-1">
                        <p className="text-sm">Scheduled</p>
                        <span className="font-bold text-2xl"> 0 </span>
                    </div>
                </div>
                <Divider sx={{ borderColor: "#404F57", width: "100%" }} />
                <div className="flex flex-row gap-6 justify-between items-center w-full">
                    <h3 className="font-md text-md">Start: Start date</h3>
                    <h3 className="font-md text-md">End: End date</h3>
                </div>
            </div>
        </div>
    );
}