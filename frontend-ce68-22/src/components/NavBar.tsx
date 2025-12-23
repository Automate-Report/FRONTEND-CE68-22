"use client"; 

import Avatar from '@mui/material/Avatar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import { Divider, Tooltip, Button, Badge } from "@mui/material";

import RobotIcon from './icon/RobotIcon';

import Link from 'next/link';



export function NavBar() {

  return (
    <div className="bg-[#0D1014] text-[#E6F0E6] w-full mb-6">
        <div className=" flex justify-between items-center px-[53px] py-3 r">
            <Link href="/main">Logo</Link>
            <div className="flex items-center gap-6">
                <div className="flex gap-10 text-xl font-semibold">
                    <Link href="/workers">
                        <div className="flex items-center gap-3">
                            <span className="leading-none pt-px">Worker</span>
                            <RobotIcon />  
                        </div>
                    </Link>
                    
                    <div className="flex items-center gap-3">
                        <span className="leading-none">Setting</span>
                        <SettingsIcon sx={{ fontSize: 24 }} />
                    </div>
                </div>
                <Tooltip title="No new messages">
                    <Button 
                        sx={{ 
                            minHeight: 0,
                            minWidth: 0,
                            padding: "10px",
                            color: "#E6F0E6" ,
                            backgroundColor: "#272D31",

                            borderRadius: "16px"
                        }}
                    >
                        <NotificationsNoneIcon />
                    </Button>
                </Tooltip>
                <Avatar 
                    alt="Username"
                    src="../../../public/default-avatar-profile-icon-social-600nw-1677509740.webp"
                    sx={{ width: 50, height: 50 }}
                />
            </div>   
        </div>
        <Divider 
            sx={{ 
                borderColor: "#D8D4D4", // กำหนดสีของเส้น (ถ้าพื้นหลังดำ ควรใช้สีเทาเข้ม)
                padding: 0
            }} 
        />
    </div>
  );
}