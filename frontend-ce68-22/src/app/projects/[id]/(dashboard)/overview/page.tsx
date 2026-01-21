"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

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
        <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl">
            
            {/* Section 1: Breadcrumbs */}
            <div className="w-full">
                <GenericBreadcrums items={breadcrumbItems} />
            </div>

            {/* Section 2: Description */}
            <div className="w-full flex flex-col gap-3">
                <h1 className="font-bold text-[36px]">
                    What's this project about?
                </h1>
                
                {/* แก้ wrap-break-word เป็น break-words */}
                <div className="bg-[#FBFBFB] text-[#404F57] border border-gray-200 rounded-2xl p-6 wrap-break-word shadow-sm">
                    {project.description}
                </div>
            </div>

            {/* Section 3: Dashboard */}
            <div className="w-full mt-6">
                <h2 className="text-[36px] font-bold mb-6">Recent Scan</h2>
                <div className="border border-gray-700 rounded-xl p-8 text-center text-gray-500">
                    {/* พื้นที่สำหรับใส่ Dashboard Content */}
                    Dashboard Content Here
                </div>
            </div>

        </div>
  );
}
