"use client";

import { useState } from "react";
import { ProjectList } from "../../components/projects/ProjectList";
import CreateProjectIcon from "@/src/components/icon/CreateProject";
import MagIcon from "@/src/components/icon/MagnifyingGlass";
import FilterIcon from "@/src/components/icon/Filter";
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
        <div className="flex justify-between items-center pr-5 flex-1">

          {/* 3. Search Box Implementation */}
          <div className="relative w-1/3 flex items-center h-[40px] gap-3 max-w-md bg-white rounded-xl pl-2 shadow-sm">
            <MagIcon />
            <input
              type="text"
              placeholder="Search Projects"
              className="w-full h-full rounded-lg text-[#4F4057] placeholder-[#9AA6A8] focus:outline-none focus:border-[#8FFF9C]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 4. Filter Implementation */}
          <div className="relative">
            {/* Trigger Button */}
            <button
              onClick={openModal}
              className="flex items-center gap-2 px-6 py-2 text-[#E6F0E6] border border-[#E6F0E6] rounded-xl hover:bg-white/10 cursor-pointer transition"
            >
              Filter <FilterIcon />
            </button>
            {/* Modal Overlay */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-[#121212] border border-white/10 w-full max-w-md p-6 rounded-2xl shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Filter Projects</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-bold-gray-400 cursor-pointer hover:text-white">
                      X
                    </button>
                  </div>

                  {/* Filter Content */}
                  <div className="space-y-4">
                      <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {filterStatusOptions.map((option) => {
                          const isActive = tempFilter === option;
                          return (
                            <button
                              key={option}
                              onClick={() => setTempFilter(option)}
                              className={`px-3 py-1 rounded-full text-sm transition-colors ${isActive
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                                }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                  </div>

                  <button
                    onClick={handleApply}
                    className="w-full mt-8 py-3 bg-[#a1ff9a] text-black font-bold rounded-xl hover:opacity-90 cursor-pointer transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
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
