"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { projectService } from "../services/project.service";
import { GenericDeleteModal } from "./Common/GenericDeleteModal";
import { Project } from "../types/project";

import OverviewIcon from "./icon/OverviewIcon";
import AssetIcon from "./icon/AssetIcon";
import ScheduleIcon from "./icon/ScheduleIcon";
import ReportIcon from "./icon/ReportIcon";
import LogIcon from "./icon/LogIcon";
import { Divider } from "@mui/material";
import EditProjectIcon from "./icon/Edit";
import DeleteProjectIcon from "./icon/Delete";
// เพิ่มไอคอนสำหรับ Worker
import EngineeringIcon from "@mui/icons-material/Engineering";

interface SideBarProps {
  project_id: number;
  project_name: string;
  role: Project["role"];
}

export function SideBar({ project_id, project_name, role }: SideBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = role === "owner";
  const canDelete = role === "owner";

  const menuSections = [
    {
      title: "INSIGHT & OVERVIEW",
      items: [
        { name: "Dashboard", href: `/projects/${project_id}/overview`, icon: <OverviewIcon /> },
        { name: "Reports Center", href: `/projects/${project_id}/report`, icon: <ReportIcon /> },
      ],
    },
    {
      title: "OPERATION CENTER",
      items: [
        { name: "Schedule Scan", href: `/projects/${project_id}/schedule`, icon: <ScheduleIcon />, roles: ["owner", "pentester"] },
        { name: "Assets", href: `/projects/${project_id}/asset`, icon: <AssetIcon /> },
        { 
          name: "Worker Nodes", 
          href: `/projects/${project_id}/workers`, 
          icon: <EngineeringIcon sx={{ fontSize: 20 }} /> 
          // เข้าถึงได้ทุก Role เพราะไม่มีการระบุ roles
        },
        { name: "Logs", href: `/projects/${project_id}/log`, icon: <LogIcon />, roles: ["owner", "pentester"] },
      ],
    },
    {
      title: "VULNERABILITY MANAGEMENT",
      items: [
        { name: "All Issues", href: `/projects/${project_id}/issues`, icon: <LogIcon /> },
        { name: "Triage & Fix", href: `/projects/${project_id}/triage`, icon: <EditProjectIcon /> },
      ],
    },
  ];

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await projectService.delete(project_id);
      setDeleteModalOpen(false);
      router.replace('/main');
      router.refresh();
    } catch (error) {
      console.error("Failed to delete project", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleStyle = (roleName: string) => {
    switch (roleName) {
      case "owner": return { color: "#8FFF9C", bg: "rgba(143, 255, 156, 0.1)", border: "rgba(143, 255, 156, 0.3)" };
      case "pentester": return { color: "#D49CFF", bg: "rgba(212, 156, 255, 0.1)", border: "rgba(212, 156, 255, 0.3)" };
      case "developer": return { color: "#70CFFF", bg: "rgba(112, 207, 255, 0.1)", border: "rgba(112, 207, 255, 0.3)" };
      default: return { color: "#EDF6EE", bg: "rgba(237, 246, 238, 0.1)", border: "rgba(237, 246, 238, 0.2)" };
    }
  };

  const roleStyle = getRoleStyle(role);

  return (
    <div className="h-[calc(100vh-74px)] bg-[#0D1014] p-4 flex flex-col fixed w-[300px] border-r border-[#2D2F39] font-sans">
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2D2F39; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #404F57; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #2D2F39 transparent; }
      `}</style>

      {/* ส่วนบน: เมนู */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar pr-2"> 
        {menuSections.map((section) => {
          const filteredItems = section.items.filter(
            (item) => !item.roles || item.roles.includes(role)
          );
          if (filteredItems.length === 0) return null;
          return (
            <div key={section.title} className="mb-6">
              <div className="px-2 mb-2">
                <h3 className="text-[#404F57] text-[11px] font-black tracking-[0.05em] uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                  {section.title}
                </h3>
              </div>
              <div className="space-y-0.5">
                {filteredItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex gap-3 px-4 py-2.5 items-center transition-all duration-200 
                        ${isActive ? "bg-[#272D31] text-[#8FFF9C] rounded-lg" : "text-[#E6F0E6] hover:bg-[#1F1F1F] hover:text-white rounded-lg"}
                      `}
                    >
                      <div className={`text-xl ${isActive ? "text-[#8FFF9C]" : "text-[#AAAAAA] group-hover:text-white"}`}>
                        {item.icon}
                      </div>
                      <div className="text-[16px] font-semibold leading-none">{item.name}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ส่วนล่าง: ล็อคติดขอบล่างเสมอ */}
      <div className="mt-auto pt-4 bg-[#0D1014]">
        <Divider sx={{ mb: 2, borderColor: "#2D2F39", opacity: 0.5 }} />
        
        <div className="space-y-1 mb-4">
          {canEdit && (
            <Link
              href={`/projects/${project_id}/edit`}
              className="flex items-center px-4 py-2.5 gap-3 text-[#E6F0E6] hover:bg-[#1F1F1F] rounded-lg transition-colors text-[14px] font-semibold"
            >
              <div className="text-xl opacity-70"><EditProjectIcon /></div>
              <span>Edit Project</span>
            </Link>
          )}
          {canDelete && (
            <div
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center px-4 py-2.5 gap-3 text-[#FF3B30] cursor-pointer hover:bg-[#FF3B3010] rounded-lg transition-colors text-[14px] font-semibold"
            >
              <div className="text-xl opacity-70"><DeleteProjectIcon /></div>
              <span>Delete Project</span>
            </div>
          )}
        </div>

        <div className="px-4 pb-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-[#404F57] text-[10px] font-bold tracking-wider uppercase">Your Role</span>
            <div 
              className="inline-flex items-center justify-center py-2 px-3 rounded-md border text-[12px] font-black tracking-widest uppercase w-full"
              style={{ 
                backgroundColor: roleStyle.bg, 
                color: roleStyle.color, 
                borderColor: roleStyle.border 
              }}
            >
              {role}
            </div>
          </div>
        </div>
      </div>

      <GenericDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityType="Project"
        entityName={project_name}
        loading={isDeleting}
      />
    </div>
  );
}