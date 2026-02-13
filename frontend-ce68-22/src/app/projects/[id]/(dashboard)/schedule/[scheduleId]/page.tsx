"use client";
import cronstrue from 'cronstrue';
import { useRouter, useParams } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { useState } from "react";
import { getDisplayDate } from "@/src/components/Common/GetDisplayDate";
import { ScheduleDelete } from "@/src/types/schedule";
import { scheduleService } from "@/src/services/schedule.service";
import { useGetScheduleByID } from "@/src/hooks/schedule/use-getScheduleByID";
import { useAsset } from '@/src/hooks/asset/use-asset';

//components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import DeleteProjectIcon from "@/src/components/icon/Delete";
import EditProjectIcon from "@/src/components/icon/Edit";
import { GenericDeleteModal } from "@/src/components/Common/GenericDeleteModal";
import { JobListByScheduleID } from '@/src/components/schedule/JobListByScheduleID';

export default function ViewSchedulePage() {

    const router = useRouter();
    const params = useParams<{ id: string; scheduleId: string }>();
    const projectId = parseInt(params.id);
    const scheduleId = parseInt(params.scheduleId);

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

            // ลบสำเร็จ -> ปิด Modal -> โหลดตารางใหม่
            setDeleteModalOpen(false);
            setscheduleToDelete(null);
            router.push(`/projects/${projectId}/schedule`);

        } catch (error) {
            console.error("Failed to delete", error);
            alert("Failed to delete schedule"); // หรือใช้ Snackbar/Toast
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

    console.log(schedule?.cron_expression || "* * * * *");

    return (
        <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl">

            {/* Section 1: Breadcrumbs */}
            <div className="w-full">
                <GenericBreadcrums items={breadcrumbItems} />
            </div>

            {/* Section 2: Headline */}
            <div className="w-full flex flex-row justify-between">
                <h1 className="font-bold text-[32px]">
                    {schedule?.schedule_name || "Loading..."}
                </h1>
                <div className="flex gap-8 items-center">
                    <button className="flex items-center justify-center bg-[#0F1518] border border-[#FE3B46] 
                    text-[#FE3B46] text-[16px] font-semibold rounded-lg px-6 py-2 gap-3 cursor-pointer 
                    hover:bg-[#FE3B46] hover:text-[#FBFBFB] transition-colors"
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

                {/* Atk type */}
                <div className="flex flex-col w-[40%] gap-3">
                    <span className="font-semibold text-2xl">Attack Type </span>
                    <input type="text" value={schedule?.attack_type || "Loading..."} readOnly
                        className="bg-[#272D31] rounded-lg px-4 py-2 text-[#E6F0E6] focus:outline-none" />
                </div>
                {/* Asset */}
                <div className="flex flex-col w-[40%] gap-3">
                    <span className="font-semibold text-2xl">Asset</span>
                    <input type="text" value={asset?.name || "Loading..."} readOnly //ค่อยแก้เป็น Asset name ทีหลัง
                        className="bg-[#272D31] rounded-lg px-4 py-2 text-[#E6F0E6] focus:outline-none" />
                </div>
                {/* Schedule Time */}
                <div className="flex flex-col w-full gap-4">
                    <span className="font-semibold text-2xl">Schedule Time </span>

                    {(schedule?.cron_expression !== "Not Repeat") && (
                        <>
                            {/* Period */}
                            <div className="flex flex-row w-full gap-3 items-center justify-start">
                                <span className="font-medium">Period From :</span>

                                <span className="bg-[#272D31] rounded-lg px-4 py-2 text-[#E6F0E6] whitespace-nowrap">
                                    {getDisplayDate(new Date(schedule?.start_date || ""))}
                                </span>

                                <span className="font-medium">To</span>

                                <span className="bg-[#272D31] rounded-lg px-4 py-2 text-[#E6F0E6] whitespace-nowrap">
                                    {getDisplayDate(new Date(schedule?.end_date || ""))}
                                </span>
                            </div>
                        </>
                    )}

                    <div className="flex flex-row gap-3">
                        {(schedule?.cron_expression == "Not Repeat") ? (
                            <div className="flex flex-row w-full gap-3 items-center justify-start">
                                <span className="font-medium">Run once at :</span>
                                <span className="bg-[#272D31] rounded-lg px-4 py-2 text-[#E6F0E6] whitespace-nowrap">
                                    {getDisplayDate(new Date(schedule?.start_date || ""))}
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-3">
                                <span className="font-medium mt-2">Run At :</span>
                                <div className="flex flex-col gap-3">
                                    {schedule?.cron_expression?.split('Z').map((cronTime, index) => (
                                        <span
                                            key={index}
                                            className="w-fit bg-[#272D31] rounded-lg px-4 py-2 text-[#E6F0E6] whitespace-nowrap"
                                        >
                                            {cronstrue.toString(cronTime || "", { verbose: true })}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 4: Table */}
            <div className="flex flex-col w-full gap-6">
                <span className="font-semibold text-2xl">Job Status </span>
                <JobListByScheduleID
                    schedule_id={scheduleId}
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