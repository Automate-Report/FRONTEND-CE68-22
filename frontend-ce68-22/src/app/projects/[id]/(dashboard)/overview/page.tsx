"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/src/hooks/use-project";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { SideBar } from "@/src/components/SideBar";

interface PageProps{
    params: Promise<{ id: string}>;
}

export default function ProjectsOverviewPage({ params }: PageProps) {
    const router = useRouter();

    const resolvePrams = use(params);
    const projectId = parseInt(resolvePrams.id);

    const { data: project, isLoading, isError} = useProject(projectId);

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

    const breadcrumbItems = [
        { label: "Home", href: "/main"},
        { label: project.name , href: undefined}
    ];



    return (
        <div className="flex mx-auto  bg-[#0F1518] text-[#E6F0E6] gap-4">
            <div className="flex flex-col px-4">
                <GenericBreadcrums items={breadcrumbItems}/>
                <div className="">
                    <div className="font-bold text-[36px] pb-3">
                        What's this project about?
                    </div>
                    <div className="bg-[#FBFBFB] text-[#404F57] border rounded-2xl p-5 wrap-break-word">
                        {project.description}
                    </div>
                </div>
                <div>
                    Dashboard
                </div>
            </div>
        </div>
  );
}
