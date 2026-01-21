"use client";

import { useState } from "react";
import { ProjectList } from "../../components/projects/ProjectList";
import CreateProjectIcon from "@/src/components/icon/CreateProject";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";

import { useDebounce } from "@/src/hooks/use-debounce";


export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [tempFilter, setTempFilter] = useState(filterStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filterStatusOptions = ["ALL", "ACTIVE", "COMPLETE", "ARCHIVED"]
  const handleApply = () => {
    setFilterStatus(tempFilter); //update the real constant
    setIsModalOpen(false);
  };

  const openModal = () => {
    setTempFilter(filterStatus);
    setIsModalOpen(true);
  };

  const debouncedSearch = useDebounce(searchQuery, 500);
  return (
    <div className="bg-[#0F1518] mt-6 mx-12">
      <div className="text-4xl text-[#E6F0E6] font-bold pb-10">
        Welcome Back! user_name
      </div>
      <div className="flex justify-between items-center mb-6 text-[#E6F0E6]">
        {/* ส่วน Search และ Filter */}
        <div className="flex gap-4 items-center flex-1">
          
          {/* 3. Search Box Implementation */}
          <div className="relative w-1/3">
             <input 
                type="text"
                placeholder="Search projects..."
                className="w-full bg-[#1A2023] border border-[#2A3033] rounded-lg px-4 py-2 text-[#E6F0E6] focus:outline-none focus:border-[#8FFF9C]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>

          {/* 4. Filter Implementation */}
          <div className="relative">
             <select 
                className="bg-[#1A2023] border border-[#2A3033] rounded-lg px-4 py-2 text-[#E6F0E6] focus:outline-none focus:border-[#8FFF9C] cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
             >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
             </select>
          </div>

        </div>

        {/* ปุ่ม New Project */}
        < GenericGreenButton
          name="New Project"
          href="/projects/create"
          icon={<CreateProjectIcon />}
        />
        
      </div>

      {/* 5. ส่งค่า Search และ Filter เป็น Props ไปให้ ProjectList */}
      <ProjectList 
        searchQuery={debouncedSearch} 
        filterStatus={filterStatus} 
      />
    </div>
  );
}
