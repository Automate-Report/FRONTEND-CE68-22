"use client";

import { useProjects } from "../../hooks/use-projects";
// import { ProjectCard } from "./ProjectCard"; <--- ไม่ใช้แล้ว หรือเก็บไว้เป็นทางเลือก
import { ProjectTable } from "./ProjectTable"; // <--- Import อันใหม่มา

export function ProjectList() {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Skeleton Loader แบบบ้านๆ */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 border border-red-200 bg-red-50 text-red-600 rounded-lg text-center">
        เกิดข้อผิดพลาดในการดึงข้อมูล ไม่สามารถเชื่อมต่อกับ Backend ได้
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 mb-2">ยังไม่มีโปรเจกต์</p>
        <p className="text-sm text-gray-400">กดปุ่มสร้างด้านบนเพื่อเริ่มต้น</p>
      </div>
    );
  }
  return (
    <div>
      {/* ส่งข้อมูล projects ไปให้ Table แสดงผล */}
      <ProjectTable data={projects} />
    </div>
  );
}