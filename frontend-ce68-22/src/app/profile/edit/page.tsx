"use client";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import DeleteProjectIcon from "@/src/components/icon/Delete";
import { useEffect, useState } from "react";
import { FILTER_BUTTON_STYLE, GREEN_BUTTON_STYLE, RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";
import { INPUT_BOX_NO_ICON_STYLE, TEXT_AREA_STYLE } from "@/src/styles/inputBoxStyle";
import { RestartAlt } from "@mui/icons-material";
import { useGetUserProfileDisplay } from "@/src/hooks/user/use-profile";
import { useRouter } from "next/navigation";
import { userService } from "@/src/services/user.service";

export default function EditProfile() {

    // Breadcrumbs
    const breadcrumbItems = [
        { label: "Your Profile", href: "/profile" },
        { label: "Edit Profile", href: undefined }
    ];

    // fetching
    const { data: user_info } = useGetUserProfileDisplay();

    // Form state
    const [form, setForm] = useState({
        firstname: user_info?.firstname ?? "",
        lastname: user_info?.lastname ?? "",
        bio: "", //dont forgor to add user_info?.bio na
        email: user_info?.email ?? "",
        password: "",
    });

    const router = useRouter();
    const [errors, setErrors] = useState({ firstname: false, lastname: false });

    useEffect(() => {
        if (user_info) {
            setForm({
                firstname: user_info.firstname ?? "",
                lastname: user_info.lastname ?? "",
                bio: "", //dont forgor to add user_info?.bio na
                email: user_info.email ?? "",
                password: "********",
            });
        }
    }, [user_info]);

    async function handleSubmit() {
        const userInfoPayload = {
            firstname: form.firstname,
            lastname: form.lastname,
        }
        await userService.updateProfile(userInfoPayload);
        router.push("/profile");
    }

    return (
        <div className="px-20 py-8 text-[#E6F0E6]">
            <GenericBreadcrums items={breadcrumbItems} />

            <div className='flex flex-row h-fit bg-[#151B1D] px-10 py-8 border-2 rounded-4xl border-[#1E2A30] my-8'>
                {/* Image */}
                <img className="w-[150px] h-[150px] object-cover rounded-xl" src="https://wallpaper-a-day.com/wp-content/uploads/2025/09/wallpaper2151.png?w=1440" alt="Profile Picture" />
                {/* Personal info */}
                <div className='ml-10 flex flex-col justify-between h-[150px]'>
                    <h1 className='text-3xl text-[#E6F0E6] font-bold mb-4'>{user_info?.firstname} {user_info?.lastname}</h1>
                    {/* button */}
                    <div>
                        <div className="flex flex-row gap-4 mb-2">
                            <button className={`${FILTER_BUTTON_STYLE} whitespace-nowrap`}>
                                Upload new <RestartAlt />
                            </button>
                            <button className={`${RED_BUTTON_STYLE}`}>
                                Remove <DeleteProjectIcon />
                            </button>
                        </div>
                        <p className='text-[#8FFF9C] text-xs'>
                            We support PNGs and JPEGs under 8MB
                        </p>
                    </div>
                </div>
            </div>

            {/* Personal Info */}
            <div className="bg-[#151B1D] px-10 py-8 border-2 rounded-4xl border-[#1E2A30] flex flex-col gap-6 mb-8">
                <label className="font-semibold text-[#E6F0E6] text-xl ">
                    Personal Information
                </label>
                <div className="grid grid-cols-2 gap-x-20 gap-y-6">
                    <div>
                        <label className="font-semibold text-[#9AA6A8] text-sm" >
                            First Name
                        </label>
                        <input
                            type="text"
                            className={`${INPUT_BOX_NO_ICON_STYLE} w-full`}
                            placeholder="e.g., John"
                            value={form.firstname}
                            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                        />
                    </div>
                    {errors.firstname && <p className="text-[#FE3B46] text-sm font-md italic">Schedule name is required</p>}

                    <div>
                        <label className="font-semibold text-[#9AA6A8] text-sm" >
                            Last Name
                        </label>
                        <input
                            type="text"
                            className={`${INPUT_BOX_NO_ICON_STYLE} w-full`}
                            placeholder="e.g., Doe"
                            value={form.lastname}
                            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                        />
                    </div>
                    {errors.lastname && <p className="text-[#FE3B46] text-sm font-md italic">Schedule name is required</p>}

                    <div className="col-span-2">
                        <label className="font-semibold text-[#9AA6A8] text-sm" >
                            Bio
                        </label>
                        <textarea
                            className={`${TEXT_AREA_STYLE}`}
                            placeholder="Tell us about yourself..."
                            value={form.bio}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        />
                    </div>

                </div>
            </div>

            {/* Security Info */}
            <div className="bg-[#151B1D] px-10 py-8 border-2 rounded-4xl border-[#1E2A30] flex flex-col gap-6">
                <label className="font-semibold text-[#E6F0E6] text-xl ">
                    Security Information
                </label>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-row items-end gap-4 w-[60%]">
                        <div className="w-full">
                            <label className="font-semibold text-[#9AA6A8] text-sm" >
                                Email
                            </label>
                            <input
                                type="text"
                                className={`${INPUT_BOX_NO_ICON_STYLE} w-full`}
                                placeholder="e.g., Amongus@gmail.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                        <button className={`${FILTER_BUTTON_STYLE} whitespace-nowrap`}>
                            Change <RestartAlt />
                        </button>
                    </div>
                    <div className="flex flex-row items-end gap-4 w-[60%]">
                        <div className="w-full">
                            <label className="font-semibold text-[#9AA6A8] text-sm" >
                                Password
                            </label>
                            <input
                                type="password"
                                className={`${INPUT_BOX_NO_ICON_STYLE} w-full`}
                                placeholder="********"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        </div>
                        <button className={`${FILTER_BUTTON_STYLE} whitespace-nowrap`}>
                            Change <RestartAlt />
                        </button>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-6 items-center mt-[30px] justify-between">
                <button
                    onClick={() => router.back()}
                    className={`${RED_BUTTON_STYLE} w-full justify-center`}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className={`${GREEN_BUTTON_STYLE} w-full`}
                >
                    Save Changes
                </button>
            </div>

        </div>
    )
}