"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";

//components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";
import { ScheduleList } from "@/src/components/schedule/ScheduleList";

//icons
import CreateScheduleIcon from "@/src/components/icon/CreateSchedule";
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from "@/src/components/icon/Filter";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectSchedulePage({ params }: PageProps) {
  const router = useRouter();

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const resolvePrams = use(params);
  const projectId = parseInt(resolvePrams.id);

  const { data: project, isLoading, isError } = useProject(projectId);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

  const breadcrumbItems = [
    { label: "Home", href: "/main" },
    { label: project.name, href: undefined }
  ];

  const showFilter = () => {
    // Logic to show filter options (e.g., open a modal or dropdown)
    alert("Show filter options");
  }

  return (
    <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl">

      {/* Section 1: Breadcrumbs */}
      <div className="w-full">
        <GenericBreadcrums items={breadcrumbItems} />
      </div>

      {/* Section 2: Headline */}
      <div className="w-full flex flex-col gap-3">
        <h1 className="font-bold text-[36px]">
          Schedule
        </h1>
      </div>

      {/* Section 3: Search and Buttons */}
      <div className="my-6 flex justify-between">

        {/* Search bar */}
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
                      focus:outline-none focus:border-[#8FFF9C]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Buttons */}
        <div className="flex gap-8 items-center">
          <button className="flex items-center justify-center bg-[#0F1518] border border-[#E6F0E6] text-[#E6F0E6] text-[16px] font-semibold rounded-lg px-6 py-2 gap-3 cursor-pointer hover:bg-[#272D31]"
            onClick={showFilter}>
            Filter
            <FilterIcon />
          </button>
          <GenericGreenButton
            name="New Schedule"
            href={`/projects/${projectId}/schedule/create`}
            icon={<CreateScheduleIcon />}
          />
        </div>
      </div>

      {/* Section 4: Table */}
      <ScheduleList
        searchQuery={searchQuery}
        filterStatus={filterStatus}
      />

    </div>
  );
}
