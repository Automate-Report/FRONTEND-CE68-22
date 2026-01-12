"use client";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
export default function ProfileEditPage() {

    const breadcrumbItems = [
            { label: "Home", href: "/main" },
            { label: "Your Profile", href: "/profile" },
            { label: "Edit Profile", href: undefined }
        ];

    return (
        <div className="mx-auto w-11/12 py-8 bg-[#0F1518]">
            <GenericBreadcrums items={breadcrumbItems} />
            <div className="text-white">This is a Profile Edit Page!!!</div>
        </div>
    );
}