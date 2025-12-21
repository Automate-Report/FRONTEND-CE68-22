"use client";

import { use } from "react";
import { useWorker } from "@/src/hooks/use-worker";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { AccessKeyBox } from "@/src/components/workers/AccessKeyBoxSection";
import EditIcon from "@/src/components/icon/Edit";

interface PageProps{
    params: Promise<{ id: string}>
}

export default function WorkerDetailPage({ params }: PageProps)
{
    const resolvePrams = use(params);
    const workerId = parseInt(resolvePrams.id);
    const { data: worker, isLoading, isError } = useWorker(workerId);

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError || !worker) return <div className="p-8 text-red-500">Worker not found</div>;

    const breadcrumbItems = [
        { label: "Worker", href: "/workers"},
        { label: worker.name , href: undefined}
    ];

    return (
        <div className="px-12 py-6 bg-[#0F1518] text-[#E6F0E6]">
            <GenericBreadcrums items={breadcrumbItems}/>

            {/* ชื่อ + แก้ไข */}
            <div className="flex justify-between py-6 text-[32px] text-[#E6F0E6] font-bold">
                {worker.name}
                < GenericGreenButton
                    name="Edit"
                    href="/workers"
                    icon={<EditIcon />}
                />
            </div>

            {/* Access Key */}
            <div className="flex flex-col justify-between  text-[32px] text-[#E6F0E6] font-bold" >
                Access Key
                <AccessKeyBox worker={worker} />
            </div>

            {/* Job Assigned */}
            <div className="flex justify-between py-6 text-[32px] text-[#E6F0E6] font-bold" >
                Job Assigned
            </div>
            
        </div>
    );
}