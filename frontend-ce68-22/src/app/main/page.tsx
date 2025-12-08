"use client";

import { useState } from "react";
import { ProjectList } from "../../components/projects/ProjectList";
import CreateProjectIcon from "@/src/components/icon/CreateProject";
import Link from "next/link";


export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  return (
    <div className="mx-auto w-11/12 bg-[#0F1518]">
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

        <Link href="/projects/create">
          <button className="flex items-center justify-center bg-[#8FFF9C] text-[#0B0F12] text-[16px] font-medium rounded-lg shadow-sm px-6 py-2 gap-3 cursor-pointer">
            <div className="text-base font-medium">
              New Project
            </div>
            <div>
              <CreateProjectIcon />
            </div>
          </button>
        </Link>
        
      </div>

      {/* 5. ส่งค่า Search และ Filter เป็น Props ไปให้ ProjectList */}
      <ProjectList 
        searchQuery={searchQuery} 
        filterStatus={filterStatus} 
      />
    </div>
  );
}
