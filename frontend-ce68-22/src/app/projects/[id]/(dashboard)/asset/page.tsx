"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";

import { AssetList } from "@/src/components/assets/AssetList";

import CreateAssetIcon from "@/src/components/icon/CreateAssertIcon";
import SearchIcon from '@mui/icons-material/Search';

interface PageProps{
    params: Promise<{ id: string}>;
}

export default function ProjectsAssetsPage({ params }: PageProps) {
    // Search
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");

    const router = useRouter();

    const resolvePrams = use(params);
    const projectId = parseInt(resolvePrams.id);

    const { data: project, isLoading, isError} = useProject(projectId);

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError || !project) return <div className="p-8 text-red-500">Asset not found</div>;

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


            <div className="font-bold text-[36px]">
              Asset
            </div>

            <div className="my-6 flex justify-between">
              <div className="relative w-2/4">
                {/*ตัว Icon: สั่ง absolute ให้ลอยอยู่ซ้าย และจัดกึ่งกลางแนวตั้ง */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon sx={{ color: "#E6F0E6" }} /> 
                </div>

                {/*ตัว Input: เพิ่ม pl-10 เพื่อเว้นที่ให้ Icon */}
                <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full bg-[#1A2023] border border-[#2A3033] rounded-lg pl-10 pr-4 py-2 text-[#E6F0E6]
                              focus:outline-none 
                            focus:border-[#8FFF9C]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-8 items-center">
                <div>filter</div>
                <GenericGreenButton 
                  name="New Asset" 
                  href={`/projects/${projectId}/asset/create`}
                  icon={<CreateAssetIcon />}
                />
              </div>
            </div>

            <AssetList 
              searchQuery={searchQuery}
              filterStatus={filterStatus}
              project_id={projectId}
            />
                

        </div>
  );
}
