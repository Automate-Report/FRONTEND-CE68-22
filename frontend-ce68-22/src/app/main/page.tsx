"use client";

import { ProjectList } from "../../components/projects/ProjectList";

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-5/6 bg-[#0F1518]">
      <div className="text-[36px] text-[#E6F0E6]">
          Welcome Back! user_name
        </div>
      <div className="flex justify-between items-center mb-6 text-[#E6F0E6]">
        <div>
          search box
        </div>
        <div>
          filter
        </div>
        
        <button className="bg-[#8FFF9C] text-[#0B0F12] text-[24px] px-6 py-3 rounded-2xl shadow-sm">
          Create Project
        </button>
      </div>

      {/* เรียกใช้ Component แค่บรรทัดเดียว! */}
      <ProjectList />
    </div>
  );
}