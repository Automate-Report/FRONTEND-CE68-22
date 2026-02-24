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
import RobotIcon from './icon/RobotIcon';

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

    const notiRef = useRef<HTMLDivElement>(null);
    const bellRef = useRef<HTMLButtonElement>(null);
    const [showNoti, setShowNoti] = useState(false);
    const [allNoti, setAllnoti] = useState(true);
    const [unread, setUnread] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

    // Fetching data
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications(showNoti, unread);
    const notifications = data?.pages.flat() ?? []; // Change shape from [[1,2],[3,4]] to [1,2,3,4]


    ////////////////////////////// Start of Noti functions //////////////////////////////
    const queryClient = useQueryClient();

    // Notiwindow Click Check
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

    // Scroll to bottom check
    const handleScrollToBottom = () => {
        const notiwindow = notiRef.current;
        if (!notiwindow) return;

        const isBottom =
            notiwindow.scrollTop + notiwindow.clientHeight >= notiwindow.scrollHeight - 5;

        if (isBottom && hasNextPage && !isFetchingNextPage) {
            setIsWaiting(true);

            setTimeout(() => {
                fetchNextPage();
                setIsWaiting(false);
            }, 1000);
        }
    };

    // Reset noti to show latest 5
    useEffect(() => {
        if (!showNoti) {
            queryClient.removeQueries({ queryKey: ["notifications"] });
        }
    }, [showNoti]);

    // Choosing Notitype
    const chooseNotiType = (type: NotificationType, projectName: string, hyperlink: string, status: NotificationStatus) => {
        if (type == "report") {
            return <NotiReportdone projectName={projectName}
                hyperlink={hyperlink}
                status={status} />
        }
    }

    ////////////////////////////// End of Noti functions //////////////////////////////

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
                                borderRadius: "14px",
                                "&:hover": {
                                    backgroundColor: "#3a4146",
                                }
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
                <div ref={notiRef} onScroll={handleScrollToBottom}
                    className={`fixed top-[88px] right-[24px] min-w-[400px] w-[30%] max-h-[60vh] overflow-y-auto bg-[#0F1518]
                    border border-[#E6F0E6] rounded-xl shadow-lg z-50 transition-opacity duration-300
                    ${showNoti ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <h3 className="text-xl font-semibold text-[#E6F0E6] p-4 border-b border-[#272D31] bg-[#0F1518] sticky top-0 z-50 h-[62px]">Notifications</h3>

                    {/* Allnoti / Unread */}
                    <div className="grid grid-cols-2 p-0 gap-0 h-[40px] border-b border-[#272D31] bg-[#0F1518] text-[#E6F0E6] sticky top-[62px] z-50">
                        <div className={`flex items-center justify-center font-semibold
                                ${allNoti
                                ? "bg-[#8FFF9C] text-[#0B0F12] hover:bg-[#AFFFB9]"
                                : "bg-[#0F1518] text-[#E6F0E6] hover:bg-[#272D31]"
                            }`}
                            onClick={() => (setAllnoti(true), setUnread(false),
                                queryClient.removeQueries({ queryKey: ["notifications"] }))}> All Notification
                        </div>

                        <div className={`flex items-center justify-center font-semibold
                                ${unread
                                ? "bg-[#8FFF9C] text-[#0B0F12] hover:bg-[#AFFFB9]"
                                : "bg-[#0F1518] text-[#E6F0E6] hover:bg-[#272D31]"
                            }`}
                            onClick={() => (setUnread(true), setAllnoti(false),
                                queryClient.removeQueries({ queryKey: ["notifications"] }))}> Unread Only
                        </div>
                    </div>

                    {/* Noti List */}
                    {allNoti &&
                        <div className='flex flex-col'>
                            {notifications?.map((noti) => (
                                <div key={noti.noti_id}>
                                    {(chooseNotiType(noti.type, noti.message, noti.hyperlink, noti.status))}
                                </div>
                            ))}
                        </div>
                    }
                    {unread &&
                        <div className='flex flex-col'>
                            {notifications?.filter((noti) => noti.status === "unread")
                                .map((noti) =>
                                    <div key={noti.noti_id}>
                                        {(chooseNotiType(noti.type, noti.message, noti.hyperlink, noti.status))}
                                    </div>
                                )}
                        </div>
                    }

                    {(isFetchingNextPage || isWaiting) && (
                        <div className="px-4 py-6">
                            <div className="relative h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                                <div className="absolute inset-0">
                                    <div className="h-full w-1/3 bg-gradient-to-r from-[#8FFF9C] via-[#FDFFDE] to-[#8FFF9C] animate-[slide_0.8s_linear_infinite]" />
                                </div>
                            </div>
                        </div>
                    )}

                    {!hasNextPage && notifications.length > 0 && (
                        <div className="px-4 pb-4">
                            <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent opacity-60" />
                        </div>
                    )}
                </div>
            }
        </>
    );
}