"use client";

import { useRouter, useParams } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { useGetScheduleByID } from "@/src/hooks/schedule/use-getScheduleByID";

//components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { Delete, Edit } from "@mui/icons-material";

export default function ViewSchedulePage() {

    const router = useRouter();
    const params = useParams<{ id: string; scheduleId: string }>();
    const projectId = parseInt(params.id);
    const scheduleId = parseInt(params.scheduleId);

    // fetching
    const { data: project } = useProject(projectId);
    const { data: schedule } = useGetScheduleByID(scheduleId);

    const breadcrumbItems = [
        { label: "Home", href: "/main" },
        { label: project?.name || "Loading...", href: `/projects/${projectId}/overview` },
        { label: "Schedule", href: `/projects/${projectId}/schedule` },
        { label: schedule?.schedule_name || "Loading...", href: undefined }
    ];

    //will use modal later
    const handleDelete = async () => {
        if (!schedule) return;
        try {
            alert(`Deleting schedule: ${schedule.schedule_name} (Just test message, wont delete fr.)`);
            router.push(`/projects/${projectId}/schedule`);
        } catch (error) {
            console.error("Failed to delete schedule:", error);
        }
    };

    return (
        <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl">

            {/* Section 1: Breadcrumbs */}
            <div className="w-full">
                <GenericBreadcrums items={breadcrumbItems} />
            </div>

            {/* Section 2: Headline */}
            <div className="w-full flex flex-row justify-between">
                <h1 className="font-bold text-[36px]">
                    {schedule?.schedule_name || "Loading..."}
                </h1>
                <div className="flex gap-8 items-center">
                    <button className="flex items-center justify-center bg-[#0F1518] border border-[#E6F0E6] text-[#E6F0E6] text-[16px] font-semibold rounded-lg px-6 py-2 gap-3 cursor-pointer hover:bg-[#272D31]"
                        onClick={handleDelete}>
                        Delete
                        <Delete />
                    </button>
                    <GenericGreenButton
                        name="Edit"
                        href={`/projects/${projectId}/schedule/${scheduleId}/edit`}
                        icon={<Edit />}
                    />
                </div>
            </div>

            {/* Section 3: Detail Boxes */}
            <div className="my-6 flex flex-col gap-6">

                {/* Atk type */}
                <div className="flex flex-col w-[40%] gap-3">
                    <span className="font-semibold text-xl">Attack Type </span>
                    <input type="text" value={schedule?.attack_type || "Loading..."} readOnly 
                    className="bg-[#272D31] rounded-lg px-4 py-2 text-[#E6F0E6] focus:outline-none"/>
                </div>
                {/* Asset */}
                <div className="flex flex-col w-[40%] gap-3">
                    <span className="font-semibold text-xl">Asset ID </span>
                    <input type="text" value={schedule?.asset_id || "Loading..."} readOnly //ค่อยแก้เป็น Asset name ทีหลัง
                    className="bg-[#272D31] rounded-lg px-4 py-2 text-[#E6F0E6] focus:outline-none"/>
                </div>
                {/* Schedule Time */}
                <div className="flex flex-col w-[40%] gap-3">
                    <span className="font-semibold text-xl">Schedule Time </span>
                    <input type="text" value={schedule?.cron_expression || "Loading..."} readOnly //แก้เป็นอันที่คนอ่านรู้เรื่องทีหลัง
                    className="bg-[#272D31] rounded-lg px-4 py-2 text-[#E6F0E6] focus:outline-none"/>
                </div>
            </div>

            {/* Section 4: Table */}
            <div className="flex flex-col w-[40%] gap-3">
                <span className="font-semibold text-2xl">Job Status </span>
                Job List Table here
            </div>

        </div>
    );
}