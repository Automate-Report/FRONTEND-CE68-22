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

interface SideBarProps {
  project_id: number;
  project_name: string;
  role: Project["role"];
}

export function SideBar({ project_id, project_name, role }: SideBarProps) {

  const router = useRouter();

  const pathname = usePathname(); //ดึง path ปัจจุบัน (/projects/overview/1)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = role === "owner";
  const canDelete = role === "owner";

  // ส่วนของการ delelte project
  const handleDeleteClick = (id: number) => {
    setDeleteModalOpen(true);
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await projectService.delete(project_id);

      // ลบเสร็จ ปิด Modal และย้ายกลับหน้า Dashboard รวม
      setDeleteModalOpen(false);
      router.replace('/main');
      router.refresh();

    } catch (error) {
      console.error("Failed to delete project", error);
      alert("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  // ส่วนของ side bar items
  const menuItems = [
    {
      name: "Overview",
      href: `/projects/${project_id}/overview`,
      icon: <OverviewIcon />,
    },
    {
      name: "Asset",
      href: `/projects/${project_id}/asset`,
      icon: <AssetIcon />,
    },
    {
      name: "Schedule",
      href: `/projects/${project_id}/schedule`,
      icon: <ScheduleIcon />,
      roles: ["owner", "pentester"]
    },
    {
      name: "Report",
      href: `/projects/${project_id}/report`,
      icon: <ReportIcon />,
    },
    {
      name: "Log",
      href: `/projects/${project_id}/log`,
      icon: <LogIcon />,
      roles: ["owner", "pentester"]
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.roles) {
      return item.roles.includes(role);
    }
    return true; // ถ้าไม่มีกำหนด roles ไว้ ให้เข้าได้ทุกคน
  });

  return (
    <div className="h-[calc(100vh-74px)] bg-[#0D1014] p-6 flex flex-col fixed w-[300px]">
      {filteredMenuItems.map((item) => {
        // เช็คว่า Path ปัจจุบัน ตรงกับ href ของปุ่มนี้หรือไม่
        // ใช้ .startsWith หรือ === ก็ได้ ขึ้นอยู่กับโครงสร้าง URL
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`w-[252px] flex gap-3 px-4 py-3
              ${isActive
                ? "bg-[#272D31] text-[#E6F0E6] rounded-lg" // สีตอน Active (เปลี่ยนได้ตาม Theme)
                : "text-[#AAAAAA] hover:bg-[#1F1F1F] hover:text-white hover:rounded-lg" // สีตอนปกติ และตอน Hover
              }
            `}
          >
            {/* คุณอาจจะต้องส่ง props สีเข้าไปใน Icon เพื่อให้เปลี่ยนสีตาม state ได้ ถ้าต้องการ */}
            <div className={isActive ? "text-white" : "text-[#AAAAAA]"}>
              {item.icon}
            </div>
            <div>{item.name}</div>
          </Link>
        );
      })}
      {(canEdit || canDelete) && (
        <div className="mt-auto">
          <Divider
            sx={{
              mb: 2,
              borderColor: "#2D2F39",
              borderBottomWidth: 3
            }}
          />
          <div>
            {/* ปุ่ม Edit: แสดงเฉพาะ owner และ pentester */}
            {canEdit && (
              <Link
                key="Edit"
                href={`/projects/${project_id}/edit`}
                className="flex items-center px-4 py-3 gap-3 text-[#E6F0E6] cursor-pointer hover:bg-[#1F1F1F] rounded-lg transition-colors"
              >
                <EditProjectIcon />
                <div>Edit Project</div>
              </Link>
            )}

            {/* ปุ่ม Delete: แสดงเฉพาะ owner เท่านั้น */}
            {canDelete && (
              <div
                onClick={() => handleDeleteClick(project_id)}
                className="flex items-center px-4 py-3 gap-3 text-[#FF3B30] cursor-pointer hover:bg-[#1F1F1F] rounded-lg transition-colors"
              >
                <DeleteProjectIcon />
                <div>Delete Project</div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* เรียกใช้ Generic Modal */}
      <GenericDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}

        // --- จุดที่ส่งข้อมูล ---
        entityType="Project"             // บอกว่าเป็น "Project"
        entityName={project_name} // ส่งชื่อโปรเจกต์ไป
        loading={isDeleting}
      />
    </div>
  );
}