"use client";

import Avatar from '@mui/material/Avatar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import { Divider, Tooltip, Button, Badge } from "@mui/material";
import RobotIcon from './icon/RobotIcon';
import Link from 'next/link';
import { getMe } from '../services/auth.service';

export function NavBar() {

    // const isAuthen = await getMe()
    const isAuthen = "1"; //for testing purpose

    return isAuthen == "1" ? (
        <div className="bg-[#0D1014] text-[#E6F0E6] w-full">
            <div className=" flex justify-between items-center px-[24px] py-3 r">
                <Link href="/main">
                    <div className="w-64 h-12 overflow-hidden rounded-lg">
                        <img
                            src="https://i.imgur.com/SjjJVdY.png"
                            alt="brand_logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="flex gap-10 text-xl font-semibold">
                        <Link href="/workers">
                            <div className="flex items-center gap-3 hover:text-[#AFFFB9]">
                                <span className="leading-none">Worker</span>
                                <RobotIcon />
                            </div>
                        </Link>

                        <Link href="/settings">
                            <div className="flex items-center gap-3 hover:text-[#AFFFB9]">
                                <span className="leading-none">Setting</span>
                                <SettingsIcon sx={{ fontSize: 24 }} />
                            </div>
                        </Link>
                    </div>
                    <Tooltip title="No new messages">
                        <Button
                            sx={{
                                minHeight: 0,
                                minWidth: 0,
                                padding: "10px",
                                color: "#E6F0E6",
                                backgroundColor: "#272D31",

                                borderRadius: "16px"
                            }}
                        >
                            <NotificationsNoneIcon />
                        </Button>
                    </Tooltip>

                    <Link href="/profile">
                        <Avatar
                            alt="Username"
                            src="../../../public/default-avatar-profile-icon-social-600nw-1677509740.webp"
                            sx={{ width: 50, height: 50 }}
                        />
                    </Link>

                </div>
            </div>
            <Divider
                sx={{
                    borderColor: "#D8D4D4", // กำหนดสีของเส้น (ถ้าพื้นหลังดำ ควรใช้สีเทาเข้ม)
                    padding: 0
                }}
            />
        </div>
    ) : ( //Unauthenticated NavBar
        <div className="bg-[#0D1014] text-[#E6F0E6] w-full">
            <div className=" flex justify-between items-center px-[48px] py-3 r">
                <Link href="/"> {/* Redirect to landing page */}
                    <div className="w-64 h-12 overflow-hidden rounded-lg">
                        <img
                            src="https://i.imgur.com/SjjJVdY.png"
                            alt="brand_logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="flex gap-10 text-xl font-semibold">
                        <Link href="/login">
                            <div className="flex items-center gap-3 hover:text-[#AFFFB9]">
                                <span className="leading-none">Login</span>
                            </div>
                        </Link>

                        <Link href="/register">
                            <div className="flex items-center gap-3 hover:text-[#AFFFB9]">
                                <span className="leading-none">Register</span>
                            </div>
                        </Link>
                    </div>
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