"use client";
import { useRouter, useParams } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { useGetScheduleByID } from "@/src/hooks/schedule/use-getScheduleByID";

//components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { Delete, Edit } from "@mui/icons-material";

export default function EditSchedulePage() {

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
        { label: schedule?.schedule_name || "Loading...", href: `/projects/${projectId}/schedule/${scheduleId}` },
        { label: "Edit", href: undefined }
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
        </div>
    );
}