"use client"; // 1. จำเป็นต้องใส่ เพราะเราจะใช้ usePathname

import Link from "next/link";
import { usePathname } from "next/navigation"; // 2. import hook นี้
import OverviewIcon from "./icon/OverviewIcon";
import AssetIcon from "./icon/AssetIcon";
import ScheduleIcon from "./icon/ScheduleIcon";
import ReportIcon from "./icon/ReportIcon";
import LogIcon from "./icon/LogIcon";
import { Divider } from "@mui/material";
import LogOutIcon from "./icon/LogoutIcon";

interface SideBarProps {
  project_id: number;
}

export function SideBar({ project_id }: SideBarProps) {
  const pathname = usePathname(); // 3. ดึง path ปัจจุบัน (เช่น /projects/overview/1)

  // 4. สร้าง config ของเมนูเพื่อลดโค้ดซ้ำ และกำหนด Link ให้ถูกต้องตามแต่ละหน้า
  const menuItems = [
    {
      name: "Overview",
      href: `/projects/${project_id}/overview`,
      icon: <OverviewIcon />,
    },
    {
      name: "Asset",
      href: `/projects/${project_id}/asset`, // แก้ Link ให้ตรงกับหน้าจริง (สมมติ)
      icon: <AssetIcon />,
    },
    {
      name: "Schedule",
      href: `/projects/${project_id}/schedule`, // แก้ Link
      icon: <ScheduleIcon />,
    },
    {
      name: "Report",
      href: `/projects/${project_id}/report`, // แก้ Link
      icon: <ReportIcon />,
    },
    {
      name: "Log",
      href: `/projects/${project_id}/log`, // แก้ Link
      icon: <LogIcon />,
    },
  ];

  return (
    <div className="bg-[#0D1014] w-[300px] h-screen sticky top-0 text-[20px] font-medium pl-2 pt-4 pb-6 pr-6 flex flex-col">
      {menuItems.map((item) => {
        // 5. เช็คว่า Path ปัจจุบัน ตรงกับ href ของปุ่มนี้หรือไม่
        // ใช้ .startsWith หรือ === ก็ได้ ขึ้นอยู่กับโครงสร้าง URL
        const isActive = pathname === item.href; 

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex gap-2 items-center px-3 py-3 rounded-lg transition-colors duration-200
              ${
                isActive
                  ? "bg-[#272D31] text-[#E6F0E6]" // สีตอน Active (เปลี่ยนได้ตาม Theme)
                  : "text-[#AAAAAA] hover:bg-[#1F1F1F] hover:text-white" // สีตอนปกติ และตอน Hover
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
      <div className="mt-auto">
        <Divider 
            sx={{ 
                mb: 2,           // margin-top: เว้นระยะห่างจากตัวหนังสือลงมาหน่อย (2 = 16px)
                borderColor: "#2D2F39", // กำหนดสีของเส้น (ถ้าพื้นหลังดำ ควรใช้สีเทาเข้ม)
                borderBottomWidth: 3
            }} 
        />
        <div className="flex items-center p-2 gap-2 text-[#FF3B30] cursor-pointer hover:bg-[#1F1F1F] rounded-lg transition-colors">
            <LogOutIcon />
            <div>Logout Accout</div>
        </div>
      </div>
    </div>
  );
}