"use client";

import { ProjectList } from "../../components/projects/ProjectList";
import CreateProjectIcon from "@/src/components/projects/icon/CreateProject";

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-11/12 bg-[#0F1518]">
      <div className="text-4xl text-[#E6F0E6] font-bold">
          Welcome Back! user_name
      </div>
      <div className="flex justify-between items-center mb-6 text-[#E6F0E6]">
        <div>
          search box
        </div>
        <div>
          filter
        </div>
        
        <button className="flex items-center justify-center bg-[#8FFF9C] text-[#0B0F12] rounded-lg shadow-sm px-6 py-2 gap-3">
          <div className="text-base font-medium">New Project</div>
          <div>
            < CreateProjectIcon />
          </div>
          
        </button>
      </div>

      {/* เรียกใช้ Component แค่บรรทัดเดียว */}
      <ProjectList />
    </div>
  );
}