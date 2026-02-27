"use client";

import { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../hooks/noti/use-noti';
import { NotificationStatus, NotificationType } from '../types/noti';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

// Components
import NotiReportdone from './Notification/Noti_ReportDone';
import Avatar from '@mui/material/Avatar';
import { Divider, Button } from "@mui/material";

// Icons
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

export function NavBar() {
    const [mounted, setMounted] = useState(false);
    const notiRef = useRef<HTMLDivElement>(null);
    const bellRef = useRef<HTMLButtonElement>(null);
    const [showNoti, setShowNoti] = useState(false);
    const [unread, setUnread] = useState(false); // ใช้แค่ unread state เดียวเพื่อสลับ All/Unread
    const [isWaiting, setIsWaiting] = useState(false);

    const queryClient = useQueryClient();
    // ✅ ส่งสถานะ unread เข้าไปใน Hook
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications(showNoti, unread);
    const notifications = data?.pages.flat() ?? [];

    useEffect(() => { setMounted(true); }, []);

    // Handle Click Outside
    useEffect(() => {
        function handleClickOutsideNoti(e: MouseEvent) {
            if (notiRef.current && !notiRef.current.contains(e.target as Node) &&
                bellRef.current && !bellRef.current.contains(e.target as Node)) {
                setShowNoti(false);
            }
        }
        if (showNoti) document.addEventListener("mousedown", handleClickOutsideNoti);
        return () => document.removeEventListener("mousedown", handleClickOutsideNoti);
    }, [showNoti]);

    if (!mounted) return <div className="bg-[#0D1014] h-[74px] w-full border-b border-[#2D2F39]"></div>;

    const handleScrollToBottom = () => {
        const notiwindow = notiRef.current;
        if (!notiwindow) return;
        const isBottom = notiwindow.scrollTop + notiwindow.clientHeight >= notiwindow.scrollHeight - 5;

        if (isBottom && hasNextPage && !isFetchingNextPage) {
            setIsWaiting(true);
            setTimeout(() => {
                fetchNextPage();
                setIsWaiting(false);
            }, 500);
        }
    };

    const chooseNotiType = (noti: any) => {
        // ✅ ตรวจสอบเงื่อนไข type ให้ตรงกับที่ Backend ส่งมา
        if (noti.type === "report") {
            return <NotiReportdone projectName={noti.message} hyperlink={noti.hyperlink} status={noti.status} />;
        }
        // กรณีมี type อื่นๆ เพิ่มเติม
        return <div className="p-4 text-sm text-gray-400 border-b border-[#272D31]">{noti.message}</div>;
    };

    return (
        <>
            {/* Navbar UI ... (คงเดิม) */}
            <div className="bg-[#0D1014] text-[#E6F0E6] w-full sticky top-0 z-50">
                <div className=" flex justify-between items-center px-[24px] py-3">
                    <Link href="/main">
                        <div className="w-64 h-12 overflow-hidden rounded-lg">
                            <img src="https://i.imgur.com/SjjJVdY.png" alt="brand_logo" className="w-full h-full object-cover" />
                        </div>
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="flex gap-10 text-xl font-semibold">
                            {/* <Link href="/settings">
                                <div className="flex items-center gap-3 hover:text-[#AFFFB9]">
                                    <span className="leading-none">Setting</span>
                                    <SettingsIcon sx={{ fontSize: 24 }} />
                                </div>
                            </Link> */}
                        </div>
                        <Button
                            sx={{ minHeight: 0, minWidth: 0, padding: "10px", color: "#E6F0E6", backgroundColor: "#272D31", borderRadius: "14px", "&:hover": { backgroundColor: "#3a4146" } }}
                            onClick={() => setShowNoti(!showNoti)}
                            ref={bellRef}
                        >
                            <NotificationsNoneIcon />
                        </Button>
                        <Link href="/profile">
                            <Avatar sx={{ width: 50, height: 50 }} />
                        </Link>
                    </div>
                </div>
                <Divider
                    sx={{
                        borderColor: "#272D31", // กำหนดสีของเส้น (ถ้าพื้นหลังดำ ควรใช้สีเทาเข้ม)
                        padding: 0
                    }}
                />
            </div>

            {/* Notification Window */}
            {showNoti && (
                <div ref={notiRef} onScroll={handleScrollToBottom}
                    className={`fixed top-[88px] right-[24px] min-w-[400px] w-[30%] max-h-[60vh] overflow-y-auto bg-[#0F1518]
                    border border-[#272D31] rounded-xl shadow-lg z-50 transition-opacity duration-300
                    ${showNoti ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <h3 className="text-xl font-semibold text-[#E6F0E6] p-4 border-b border-[#272D31] bg-[#0F1518] sticky top-0 z-50 h-[62px]">Notifications</h3>

                    {/* Tab Switcher */}
                    <div className="grid grid-cols-2 h-[40px] border-b border-[#272D31] sticky top-[62px] z-50 cursor-pointer">
                        <div className={`flex items-center justify-center font-semibold transition-colors ${!unread ? "bg-[#8FFF9C] text-[#0B0F12]" : "text-[#9AA6A8] hover:bg-[#272D31]"}`}
                            onClick={() => setUnread(false)}>
                            All
                        </div>
                        <div className={`flex items-center justify-center font-semibold transition-colors ${unread ? "bg-[#8FFF9C] text-[#0B0F12]" : "text-[#9AA6A8] hover:bg-[#272D31]"}`}
                            onClick={() => setUnread(true)}>
                            Unread Only
                        </div>
                    </div>

                    {/* Noti List */}
                    <div className='flex flex-col'>
                        {notifications.length > 0 ? (
                            notifications.map((noti) => (
                                <div key={noti.noti_id}>{chooseNotiType(noti)}</div>
                            ))
                        ) : !isFetchingNextPage && (
                            <div className="p-10 text-center text-[#404F57]">No notifications</div>
                        )}
                    </div>

                    {/* Loading Indicator */}
                    {(isFetchingNextPage || isWaiting) && (
                        <div className="px-4 py-6">
                            <div className="relative h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                                <div className="h-full w-1/3 bg-[#8FFF9C] animate-[slide_0.8s_linear_infinite]" />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}