"use client";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { Divider } from "@mui/material";
export default function ProfileEditPage() {

    const breadcrumbItems = [
        { label: "Home", href: "/main" },
        { label: "Your Profile", href: "/profile" },
        { label: "Edit Profile", href: undefined }
    ];

    return (
        <div className="flex flex-col mx-auto w-11/12 py-8 bg-[#0F1518] text-[#E6F0E6]">
            <GenericBreadcrums items={breadcrumbItems} />
            <div className="mt-2 mb-10">
                <div className="font-bold text-[36px]">Account Info</div>
                <Divider
                    sx={{
                        mt: 2,           // margin-top: เว้นระยะห่างจากตัวหนังสือลงมาหน่อย (2 = 16px)
                        borderColor: "#D8D4D4", // กำหนดสีของเส้น (ถ้าพื้นหลังดำ ควรใช้สีเทาเข้ม)
                        borderBottomWidth: 1
                    }}
                />
            </div>
            <div className="flex w-full items-center p-7 gap-6 rounded-2xl border border-[#e6f0e6] bg-[#0f1518] p-6 shadow-md">
                <div>
                    <img
                        src="@/src/app/favicon.ico" // ใส่ URL รูป
                        alt="Profile Picture"
                        className="h-35 w-35 rounded-xl object-cover border border-gray-700"
                    />
                </div>
                <div className="flex flex-col gap-4 h-full">
                    <div className="flex items-center gap-8">
                        <button className="flex items-center h-full gap-3 rounded-lg bg-transparent px-6 py-2 border-1 border-[#e6f0e6] text-xl font-semibold text-[#e6f0e6] cursor-pointer">
                            Change Image
                        </button>
                        <button className="flex items-center h-full gap-3 rounded-lg bg-transparent px-6 py-2 border-1 border-[#fe3b46] text-xl font-semibold text-[#fe3b46] cursor-pointer">
                            Remove Image
                        </button>
                    </div>
                    <div className="text-[#9aa6a8] text-xl mt-5 font-light">
                        We support PNGs and  JPEGs under 2MB
                    </div>
                </div>
            </div>
            <div className="flex flex col">
                    kldjfgh
            </div>
        </div>

    );
}