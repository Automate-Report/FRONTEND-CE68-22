"use client";

import { use, useEffect, useRef, useState } from 'react';
import { useNotifications } from '../hooks/noti/use-noti';
import { useInvitations, useAcceptInvitation, useDeclineInvitation } from '../hooks/invitation/use-invite';
import { NotificationStatus, NotificationType } from '../types/noti';
import { Invite } from '../types/invite';
import { logout } from '@/src/services/auth.service';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

// Components
import NotiReportdone from './Notification/Noti_ReportDone';
import Avatar from '@mui/material/Avatar';
import { Divider, Button } from "@mui/material";

// Icons
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useRouter } from 'next/navigation';
import { GREEN_BUTTON_STYLE } from '../styles/greenButton';
import { RED_BUTTON_STYLE } from '../styles/buttonStyle';

export function NavBar() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const notiRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const bellRef = useRef<HTMLButtonElement>(null);
    const inviteRef = useRef<HTMLButtonElement>(null);
    const inviteWindowRef = useRef<HTMLDivElement>(null);
    const [showNoti, setShowNoti] = useState(false);
    const [showInvite, setShowInvite] = useState(false);
    const [unread, setUnread] = useState(false); // ใช้แค่ unread state เดียวเพื่อสลับ All/Unread
    const [isWaiting, setIsWaiting] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const queryClient = useQueryClient();
    // ✅ ส่งสถานะ unread เข้าไปใน Hook
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications(showNoti, unread);
    const notifications = data?.pages.flat() ?? [];
    const { data: invitations, isLoading: isInvitationsLoading } = useInvitations();
    const acceptInvitation = useAcceptInvitation();
    const declineInvitation = useDeclineInvitation();

    useEffect(() => { setMounted(true); }, []);

    // Handle Click Outside
    useEffect(() => {
        function handleClickOutsideProfile(e: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setShowProfileDropdown(false);
            }
        }
        if (showProfileDropdown) document.addEventListener("mousedown", handleClickOutsideProfile);
        return () => document.removeEventListener("mousedown", handleClickOutsideProfile);
    }, [showProfileDropdown]);

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

    useEffect(() => {
        function handleClickOutsideInvite(e: MouseEvent) {
            if (inviteWindowRef.current && !inviteWindowRef.current.contains(e.target as Node) &&
                inviteRef.current && !inviteRef.current.contains(e.target as Node)) {
                setShowInvite(false);
            }
        }
        if (showInvite) document.addEventListener("mousedown", handleClickOutsideInvite);
        return () => document.removeEventListener("mousedown", handleClickOutsideInvite);
    }, [showInvite]);


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

    async function handleLogout(e: React.FormEvent) {
        e.preventDefault();
        setShowProfileDropdown(false)
        const message = await logout();
        router.push("/login");
        router.refresh();
    }

    function handleAcceptInvite(invite: Invite) {
        acceptInvitation.mutate(invite.project_id);
        window.location.reload();
    }

    return (
        <>
            {/* Navbar UI ... (คงเดิม) */}
            <div className="bg-[#0D1014] text-[#E6F0E6] w-full sticky top-0 z-50 border-b border-[#272D31]">
                <div className=" flex justify-between items-center px-[24px] py-3">
                    <Link href="/main">
                        <div className="h-12 overflow-hidden rounded-lg">
                            <img src="pest10_logo.png" alt="brand_logo" className="w-full h-full object-cover" />
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
                            onClick={() => setShowInvite(!showInvite)}
                            ref={inviteRef}
                        >
                            <EmailOutlinedIcon />
                        </Button>
                        <Button
                            sx={{ minHeight: 0, minWidth: 0, padding: "10px", color: "#E6F0E6", backgroundColor: "#272D31", borderRadius: "14px", "&:hover": { backgroundColor: "#3a4146" } }}
                            onClick={() => setShowNoti(!showNoti)}
                            ref={bellRef}
                        >
                            <NotificationsNoneIcon />
                        </Button>
                        <button onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                            <Avatar sx={{ width: 50, height: 50 }} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
                <div ref={profileRef} className="absolute top-[88px] right-[24px] w-[150px] bg-[#0F1518] border-2 border-[#272D31] rounded-lg shadow-lg z-50">
                    <Link href="/profile" onClick={() => setShowProfileDropdown(false)} className="block px-4 py-2 text-sm text-[#E6F0E6] hover:bg-[#272D31]">
                        My Profile
                    </Link>
                    <Link href="/profile/edit" onClick={() => setShowProfileDropdown(false)} className="block px-4 py-2 text-sm text-[#E6F0E6] hover:bg-[#272D31]">
                        Edit Profile
                    </Link>
                    <button onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-[#E6F0E6] hover:bg-[#272D31] hover:text-[#FF6B6B]">
                        Log Out
                    </button>
                </div>
            )}

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

            {/* Invite Window */}
            {showInvite && (
                <div ref={inviteWindowRef} className="absolute top-[88px] right-[24px] w-[300px] bg-[#0F1518] border-2 border-[#272D31] rounded-lg shadow-lg z-50">
                    <h3 className="text-xl font-semibold text-[#E6F0E6] p-4 border-b border-[#272D31]">Invitations</h3>
                    <div className="p-3 flex flex-col max-h-[400px] overflow-y-auto">
                        {isInvitationsLoading ? (
                            <div>
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#8FFF9C] mx-auto"></div>
                                <p className="text-[#9AA6A8] mt-2">Loading invitations...</p>
                            </div>
                        ) : invitations?.length ? (
                            invitations.map((invite, index) => (
                                <div key={index} className="my-1 p-3 bg-[#272D31] rounded-lg">
                                    <p className="text-m text-[#E6F0E6]"><span className="font-semibold">{invite.project_name}</span> - Invited by {invite.project_owner}</p>
                                    <p className="text-m text-[#9AA6A8]">Role: {invite.role}</p>
                                    <p className="text-s text-[#9AA6A8]">Invited at: {new Date(invite.invited_at).toLocaleString()}</p>
                                    <div className='flex justify-around mt-2'>
                                        <button className={`${GREEN_BUTTON_STYLE}`}
                                                onClick={() => handleAcceptInvite(invite)}
                                        >
                                            Accept
                                        </button>
                                        <button className={`${RED_BUTTON_STYLE}`}
                                                onClick={() => declineInvitation.mutate(invite.project_id)}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-[#9AA6A8]">No invitations at the moment.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}