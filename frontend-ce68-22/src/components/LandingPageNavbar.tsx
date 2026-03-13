"use client";

import { Divider } from "@mui/material";
import Link from 'next/link';
import { GREEN_BUTTON_STYLE } from "../styles/buttonStyle";

export function LandingPageNavbar() {
    return (
        <div className="bg-[#0D1014] text-[#E6F0E6] w-full fixed top-0 left-0 right-0 z-50 border-b border-[#272D31] px-40">
            <div className=" flex justify-between items-center px-[48px] py-3 r">
                <Link href="/"> {/* Redirect to landing page */}
                    <div className="h-12 overflow-hidden rounded-lg">
                        <img
                            src="pest10_logo.png"
                            alt="brand_logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-6">
                        <a href="#features" className="text-base font-semibold text-[#9AA6A8] transition-colors hover:text-[#8FFF9C]">
                            FEATURES
                        </a>
                        <a href="#about" className="text-base font-semibold text-[#9AA6A8] transition-colors hover:text-[#8FFF9C]">
                            ABOUT
                        </a>
                        <Link
                            href="/login"
                            className="flex items-center justify-center bg-[#8FFF9C] text-[#0B0F12] text-[14px] font-bold rounded-lg px-6 py-2 gap-3 cursor-pointer hover:shadow-[0_0_18px_rgba(34,197,94,0.9)]"
                        >
                            LOGIN
                        </Link>
                    </div>
                </div>
            </div>
            <Divider
                sx={{
                    borderColor: "#272D31", // กำหนดสีของเส้น (ถ้าพื้นหลังดำ ควรใช้สีเทาเข้ม)
                    padding: 0
                }}
            />
        </div>
    );
}