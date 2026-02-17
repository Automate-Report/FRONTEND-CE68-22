"use client";

import Avatar from '@mui/material/Avatar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import { Divider, Tooltip, Button, Badge } from "@mui/material";
import RobotIcon from './icon/RobotIcon';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import NotiReportdone from './Notification/Noti_ReportDone';


export function NavBar() {

    const notiRef = useRef<HTMLDivElement>(null);
    const bellRef = useRef<HTMLButtonElement>(null);
    const [showNoti, setShowNoti] = useState(false);
    const toggleNotiWindow = () => {
        setShowNoti(prev => !prev);
    }

    useEffect(() => {
        function handleClickOutsideNoti(e: MouseEvent) {
            if (notiRef.current && !notiRef.current.contains(e.target as Node) &&
                bellRef.current && !bellRef.current.contains(e.target as Node)) {
                setShowNoti(false);
            }
        }

        if (showNoti) {
            document.addEventListener("mousedown", handleClickOutsideNoti);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideNoti);
        };
    }, [showNoti]);

    return (
        <>
            {/* Whole navbar */}
            <div className="bg-[#0D1014] text-[#E6F0E6] w-full sticky top-0 z-50">
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
                        <Button
                            sx={{
                                minHeight: 0,
                                minWidth: 0,
                                padding: "10px",
                                color: "#E6F0E6",
                                backgroundColor: "#272D31",

                                borderRadius: "16px"
                            }}
                            onClick={toggleNotiWindow}
                            ref={bellRef}
                        >
                            <NotificationsNoneIcon />
                        </Button>

                        <Link href="/profile">
                            <Avatar
                                alt="Username"
                                src="https://commons.wikimedia.org/wiki/File:Twitter_default_profile_400x400.png"
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

            {/* Notification Window */}
            {showNoti &&
                <div ref={notiRef}
                    className={`fixed top-[88px] right-[24px] min-w-[400px] w-[30%] max-h-[50vh] overflow-y-auto bg-[#0F1518]
                    border border-[#E6F0E6] rounded-xl shadow-lg z-50 transition-opacity duration-300
                    ${showNoti ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <h3 className="text-xl font-semibold text-[#E6F0E6] p-4 border-b border-[#272D31] bg-[#0F1518] sticky top-0">Notifications</h3>
                    <div className='flex flex-col'>
                        <NotiReportdone projectName='Bunny is cute but bunnygirl is cutest' hyperlink='/main' />
                        <NotiReportdone projectName='Another Project' hyperlink='/main' />
                        <NotiReportdone projectName='Third Project' hyperlink='/main' />
                        <NotiReportdone projectName='Fourth Project' hyperlink='/main' />
                    </div>

                    {/* if noticount == 0 display below*/}
                    {/* <p className="text-sm text-[#E6F0E6]">No new notifications.</p>  */}
                </div>
            }
        </>
    );
}