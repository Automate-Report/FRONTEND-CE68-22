"use client";

import { Divider } from "@mui/material";
import Link from 'next/link';

export function LandingPageNavbar() {
    return (
        <div className="bg-[#0D1014] text-[#E6F0E6] w-full sticky top-0">
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
                    borderColor: "#272D31", // กำหนดสีของเส้น (ถ้าพื้นหลังดำ ควรใช้สีเทาเข้ม)
                    padding: 0
                }}
            />
        </div>
    );
}