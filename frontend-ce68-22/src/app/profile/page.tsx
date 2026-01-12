"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import Link from "next/link";
import BadgeIcon from "@/src/components/icon/Badge";

export default function ProfilePage() {

    const breadcrumbItems = [
        { label: "Home", href: "/main" },
        { label: "Your Profile", href: undefined }
    ];

    return (
        <div className="mx-auto w-11/12 py-8 bg-[#0F1518]">
            <GenericBreadcrums items={breadcrumbItems} />
            <div className="flex w-full max-w-4xl items-center gap-6 rounded-2xl border border-[#e6f0e6] bg-[#0f1518] p-6 shadow-md">
                {/* ส่วนกล่อง profile */}
                <div>
                    <img
                        src="@/src/app/favicon.ico" // ใส่ URL รูป
                        alt="Tsuyu Asui"
                        className="h-28 w-28 rounded-xl object-cover border border-gray-700"
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="text-2xl font-bold text-[#e6f0e6]">
                            Tsuyu Asui
                        </div>
                        <BadgeIcon />
                    </div>
                    <div className="text-[#9aa6a8] text-sm mb-5 font-light">
                        Frog.ribbitribbit@mha.ac.th
                    </div>
                    <div className="flex gap-8">
                        <Link href="/profile/edit">
                            <button className="flex items-center gap-3 rounded-lg bg-[#8fff9c] px-6 py-2 text-sm font-bold text-[#0b0f12] cursor-pointer">
                                Edit
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 17.5H17.5" stroke="#0B0F12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M5.8335 14.1667V10.8333L14.1668 2.5L17.5002 5.83333L9.16683 14.1667H5.8335Z" stroke="#0B0F12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M11.6665 5L14.9998 8.33333" stroke="#0B0F12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </Link>
                        <Link href="/main">
                            <button className="flex items-center gap-2 rounded-lg bg-[#8fff9c] px-6 py-2 text-sm font-bold text-[#0b0f12] cursor-pointer">
                                Subscription
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}