"use client";
import { useRouter, useParams } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { useState, useEffect } from "react";
import { getDisplayDate } from "@/src/components/Common/GetDisplayDate";
import { ScheduleDelete } from "@/src/types/schedule";
import { scheduleService } from "@/src/services/schedule.service";
import { useGetScheduleByID } from "@/src/hooks/schedule/use-getScheduleByID";
import { useAsset } from '@/src/hooks/asset/use-asset';
import { useProjectRole } from "@/src/context/ProjectDetailConext";

//components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import CardWithIcon from '@/src/components/Common/CardWithIcon';


import DeleteProjectIcon from "@/src/components/icon/Delete";
import EditProjectIcon from "@/src/components/icon/Edit";
import SwordIcon from '@/src/components/icon/SwordIcon';
import NetworkIcon from '@/src/components/icon/NetworkIcon';
import StopIcon from '@/src/components/icon/StopIcon';
import StartIcon from '@/src/components/icon/StartIcon';

import { JobListByScheduleID } from '@/src/components/schedule/JobListByScheduleID';


import { formatCronExpressions } from "@/src/lib/format";
import { RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";
import { showToast } from "@/src/components/Common/ToastContainer";
import { Delete, Close } from "@mui/icons-material";

export default function ViewSchedulePage() {
    const { role } = useProjectRole();

    const router = useRouter();
    const params = useParams<{ id: string; scheduleId: string }>();
    const projectId = parseInt(params.id);
    const scheduleId = parseInt(params.scheduleId);

    useEffect(() => {
        if (role?.toLowerCase() === "developer") {
            router.replace(`/projects/${projectId}/overview`);
        }
    }, [role, projectId, router]);

    // fetching
    const { data: project, isLoading, isError } = useProject(projectId);
    const { data: schedule } = useGetScheduleByID(scheduleId);
    const { data: asset } = useAsset(schedule?.asset_id || 0);

    //state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [scheduleToDelete, setscheduleToDelete] = useState<ScheduleDelete | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbItems = [
        { label: "Home", href: "/main" },
        { label: project?.name || "Loading...", href: `/projects/${projectId}/overview` },
        { label: "Schedule", href: `/projects/${projectId}/schedule` },
        { label: schedule?.schedule_name || "Loading...", href: undefined }
    ];



    const handleDeleteClick = (schedule: ScheduleDelete) => {
        setscheduleToDelete({ id: schedule.id, name: schedule.name });
        setDeleteModalOpen(true);
    };

    // 2. เมื่อกดยืนยันใน Modal
    const handleConfirmDelete = async () => {
        if (!scheduleToDelete) return;

        setIsDeleting(true);
        try {
            await scheduleService.delete(scheduleToDelete.id);
            showToast({
                icon: <Delete sx={{ fontSize: "20px", color: "#4CAF8A" }} />,
                message: `Schedule "${scheduleToDelete.name}" deleted successfully!`,
                borderColor: "#8FFF9C",
                duration: 6000,
            });
            // ลบสำเร็จ -> ปิด Modal -> โหลดตารางใหม่
            setDeleteModalOpen(false);
            setscheduleToDelete(null);
            router.push(`/projects/${projectId}/schedule`);

        } catch (error) {
            showToast({
                icon: <Close sx={{ fontSize: "20px", color: "#FE3B46" }} />,
                message: "Failed to delete schedule :(",
                borderColor: "#FE3B46",
                duration: 6000,
            });
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

    return (
        <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl">

            {/* Section 1: Breadcrumbs */}
            <div className="w-full">
                <GenericBreadcrums items={breadcrumbItems} />
            </div>

            {/* Section 2: Headline */}
            <div className="w-full flex flex-row justify-between">
                <h1 className="font-bold text-[32px]">
                    {schedule?.schedule_name || "Fetching info..."}
                </h1>
                <div className="flex gap-8 items-center">
                    <button className={RED_BUTTON_STYLE}
                        onClick={() => handleDeleteClick({ id: scheduleId, name: schedule?.schedule_name || "" })}>
                        Delete
                        <DeleteProjectIcon />
                    </button>
                    <GenericGreenButton
                        name="Edit"
                        href={`/projects/${projectId}/schedule/${scheduleId}/edit`}
                        icon={<EditProjectIcon />}
                    />
                </div>
            </div>

            {/* Section 3: Detail Boxes */}
            <div className="my-6 flex flex-col gap-6">
                {(schedule?.cron_expression !== "Not Repeat") && (
                    <div className='flex flex-col xl:flex-row gap-6 h-fit w-full'>
                        <div className='grid grid-cols-1 grid-rows-4 xl:grid-cols-2 xl:grid-rows-2 gap-6 place-items-center w-full xl:w-[66%]'>
                            <CardWithIcon
                                icon={<SwordIcon />}
                                title="ATTACK TYPE"
                                dataDisplay={schedule?.attack_type || "Fetching Data..."}
                                description=""
                            />
                            <CardWithIcon
                                icon={<NetworkIcon width={30} height={30} />}
                                title="ASSET"
                                dataDisplay={asset?.name || "Fetching Data..."}
                                description={`Target : ${asset?.target || "No target defined"}`}
                                descriptioncolor='#8FFF9C'
                            />
                            <CardWithIcon
                                icon={<StartIcon />}
                                title="START AT"
                                dataDisplay={getDisplayDate(new Date(schedule?.start_date || ""), "card") || "Fetching Data..."}
                                description=""
                            />
                            <CardWithIcon
                                icon={<StopIcon />}
                                title="END AT"
                                dataDisplay={getDisplayDate(new Date(schedule?.end_date || ""), "card") || "Fetching Data..."}
                                description=""
                            />
                        </div>

                        {/* Cron Expression Box */}
                        <div className='flex flex-col items-center justify-between border border-[rgba(64,79,87,0.4)] w-full xl:w-[33%] rounded-xl p-6'>
                            <span className="font-semibold text-2xl pb-4">Schedule Frequency</span>
                            <div className="relative flex items-center justify-center w-full h-16 bg-[#272D31] rounded-xl mb-4">
                                <p className='font-bold text-3xl truncate p-6'>
                                    {schedule?.cron_expression?.split('Z')[0]}
                                </p>
                                {schedule?.cron_expression?.split('Z') && schedule?.cron_expression?.split('Z').length > 1 && (
                                    <span className="absolute bottom-[-8px] right-[-8px] text-sm font-bold text-[#8FFF9C] p-2 bg-[#32423C] border-[2px] border-[rgba(143,255,156,0.3)] rounded-xl">
                                        +{schedule?.cron_expression?.split('Z').length - 1} more
                                    </span>
                                )}
                            </div>
                            <p className="text-[#96A6A6]">This Schedule run
                                <span className="font-semibold text-[#8FFF9C]">
                                    {' '}"{formatCronExpressions(schedule?.cron_expression || "")}"
                                </span>
                            </p>
                        </div>
                    </div>
                )}
                {(schedule?.cron_expression == "Not Repeat") && (
                    <div className='flex flex-col xl:flex-row gap-6 h-fit w-full'>
                        <div className='grid grid-cols-1 grid-rows-3 xl:grid-cols-3 xl:grid-rows-1 gap-6 place-items-center w-full'>
                            <CardWithIcon
                                icon={<SwordIcon />}
                                title="ATTACK TYPE"
                                dataDisplay={schedule?.attack_type || "Fetching Data..."}
                                description=""
                            />
                            <CardWithIcon
                                icon={<NetworkIcon width={30} height={30} />}
                                title="ASSET"
                                dataDisplay={asset?.name || "Fetching Data..."}
                                description={`Target : ${asset?.target || "No target defined"}`}
                                descriptioncolor='#8FFF9C'
                            />
                            <CardWithIcon
                                icon={<StartIcon />}
                                title="RUN ONCE AT"
                                dataDisplay={getDisplayDate(new Date(schedule?.start_date || ""), "card") || "Fetching Data..."}
                                description={`Time Scheduled : ${getDisplayDate(new Date(schedule?.start_date || ""), "time") || "No time defined"}`}
                                descriptioncolor='#8FFF9C'
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Section 4: Table */}
            <div className="flex flex-col w-full gap-6">
                <span className="font-semibold text-2xl">Job Status </span>
                <JobListByScheduleID
                    schedule_id={scheduleId}
                    project_id={projectId}
                />
            </div>

            {scheduleToDelete && (
                <GenericDeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}

                    // --- จุดที่ส่งข้อมูล ---
                    entityType="Project"             // บอกว่าเป็น "Project"
                    entityName={scheduleToDelete.name} // ส่งชื่อโปรเจกต์ไป
                    loading={isDeleting}
                />
            )}
        </div>
    );
}