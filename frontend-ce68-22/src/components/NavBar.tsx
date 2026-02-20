"use client";

import { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import { Divider, Tooltip, Button, Box } from "@mui/material";
import Link from 'next/link';

export function NavBar() {
    const [mounted, setMounted] = useState(false);

    // ป้องกัน Hydration Error โดยรอให้ Client Mount เสร็จก่อน
    useEffect(() => {
        setMounted(true);
    }, []);

    // ถ้ายังไม่ mounted ให้ render โครงสร้างว่างๆ หรือ Placeholder ที่มีขนาดเท่ากัน
    if (!mounted) {
        return <div className="bg-[#0D1014] h-[74px] w-full border-b border-[#2D2F39]"></div>;
    }

    return (
        <div className="bg-[#0D1014] text-[#E6F0E6] w-full sticky top-0 z-50">
            <div className="flex justify-between items-center px-[24px] py-3">
                
                {/* Logo Section */}
                <Link href="/main">
                    <div className="w-64 h-12 overflow-hidden rounded-lg flex items-center cursor-pointer">
                        <img
                            src="https://i.imgur.com/SjjJVdY.png"
                            alt="brand_logo"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </Link>

                {/* Right Section: Actions & Profile */}
                <div className="flex items-center gap-6">
                    
                    {/* Settings Link */}
                    <Link href="/settings">
                        <div className="flex items-center gap-2 text-[16px] font-bold cursor-pointer hover:text-[#AFFFB9] transition-colors">
                            <span className="leading-none">Setting</span>
                            <SettingsIcon sx={{ fontSize: 22 }} />
                        </div>
                    </Link>

                    {/* Notification Button */}
                    <Tooltip title="No new messages">
                        <Button
                            sx={{
                                minHeight: 0,
                                minWidth: 0,
                                padding: "10px",
                                color: "#E6F0E6",
                                backgroundColor: "#272D31",
                                borderRadius: "14px",
                                "&:hover": {
                                    backgroundColor: "#3a4146",
                                }
                            }}
                        >
                            <NotificationsNoneIcon />
                        </Button>
                    </Tooltip>

                    {/* Profile Avatar */}
                    <Link href="/profile">
                        <Avatar
                            alt="User Profile"
                            // ใช้รูปโปรไฟล์เริ่มต้นจาก GitHub หรือ URL ที่แน่นอน
                            src="https://ui-avatars.com/api/?name=User&background=272D31&color=AFFFB9"
                            sx={{ 
                                width: 45, 
                                height: 45, 
                                cursor: 'pointer',
                                border: '2px solid transparent',
                                '&:hover': {
                                    borderColor: '#AFFFB9'
                                }
                            }}
                        />
                    </Link>
                </div>
            </div>
            
            {/* Divider: ปรับสีให้กลมกลืนกับพื้นหลังเข้ม */}
            <Divider
                sx={{
                    borderColor: "#2D2F39", 
                    opacity: 0.8
                }}
            />
        </div>
    );
}