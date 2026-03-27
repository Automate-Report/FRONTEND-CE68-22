"use client";
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import DeleteProjectIcon from "@/src/components/icon/Delete";
import { useEffect, useState } from "react";
import { FILTER_BUTTON_STYLE, GREEN_BUTTON_STYLE, RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";
import { INPUT_BOX_NO_ICON_STYLE, TEXT_AREA_STYLE } from "@/src/styles/inputBoxStyle";
import { CheckCircle, Close, RestartAlt, WarningAmber } from "@mui/icons-material";
import { useGetUserProfileDisplay } from "@/src/hooks/user/use-profile";
import { useRouter } from "next/navigation";
import { userService } from "@/src/services/user.service";
import { logout } from "@/src/services/auth.service";
import { showToast } from "@/src/components/Common/ToastContainer";

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

    const [formEmail, setFormEmail] = useState({
        newEmail: "",
        confirmNewEmail: "",
    });

    const [formPassword, setFormPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    //Modal state
    const [openEmailModal, setOpenEmailModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);

    const router = useRouter();
    const [errors, setErrors] = useState({ firstname: false, lastname: false });
    const [errorsEmail, setErrorsEmail] = useState({ notMatch: false, used: false });
    const [errorsPassword, setErrorsPassword] = useState({ notMatch: false, incorrect: false });

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

    // Handlers
    async function handleSubmit() {
        const userInfoPayload = {
            firstname: form.firstname,
            lastname: form.lastname,
        }
        await userService.updateProfile(userInfoPayload);
        router.push("/profile");
        showToast({
            icon: <CheckCircle sx={{ fontSize: "20px", color: "#4CAF8A" }} />,
            message: `Your changes have been saved`,
            borderColor: "#8FFF9C",
            duration: 6000,
        });
    }

    async function handleConfirmEmailChange() {
        // check if 2 email match
        if (formEmail.newEmail !== formEmail.confirmNewEmail) {
            setErrorsEmail({ ...errorsEmail, notMatch: true });
            return;
        }

        const status = await userService.updateEmail(formEmail.newEmail);
        if (status === "Used") {
            setErrorsEmail({ ...errorsEmail, used: true });
            return;
        }
        setOpenEmailModal(false);
        await logout();
        router.push("/login");
        router.refresh();
    }

    async function handleConfirmPasswordChange() {
        // check if 2 password match
        if (formPassword.newPassword !== formPassword.confirmNewPassword) {
            setErrorsPassword({ ...errorsPassword, notMatch: true });
            return;
        }

        const passwordPayload = {
            old_password: formPassword.currentPassword,
            new_password: formPassword.newPassword,
        }

        const status = await userService.updatePassword(passwordPayload);
        if (status === "Incorrect") {
            setErrorsPassword({ ...errorsPassword, incorrect: true });
            return;
        }
        setOpenPasswordModal(false);
        await logout();
        router.push("/login");
        router.refresh();
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
                    {errors.firstname && <p className="text-[#FE3B46] text-sm font-md italic">Firstname is required</p>}

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
                    {errors.lastname && <p className="text-[#FE3B46] text-sm font-md italic">Lastname is required</p>}

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
                                readOnly
                            />
                        </div>
                        <button className={`${FILTER_BUTTON_STYLE} whitespace-nowrap`}
                            onClick={() => setOpenEmailModal(true)}
                        >
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
                                readOnly
                            />
                        </div>
                        <button className={`${FILTER_BUTTON_STYLE} whitespace-nowrap`}
                            onClick={() => setOpenPasswordModal(true)}
                        >
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
                    Back to Profile
                </button>
                <button
                    onClick={handleSubmit}
                    className={`${GREEN_BUTTON_STYLE} w-full`}
                >
                    Save Changes
                </button>
            </div>

            {/* Edit Email Modal */}
            {openEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border-[2px] border-[#2D2F39] border-t-0 bg-[#1E2429] shadow-2xl overflow-hidden relative">

                        {/* Top danger strip */}
                        <div className="h-0.5 w-full bg-[#8FFF9C]" />

                        {/* X */}
                        <button
                            onClick={() => setOpenEmailModal(false)}
                            className="rounded-lg p-1.5 text-[#9AA6A8] transition-colors hover:text-[#FBFBFB] absolute top-2 right-2"
                        >
                            <Close fontSize="small" />
                        </button>

                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3 text-[#8FFF9C]">
                                    <WarningAmber sx={{ fontSize: 28 }} />
                                    <h2 className="font-bold text-xl leading-tight text-[#8FFF9C]">
                                        Change Email
                                    </h2>
                                </div>
                            </div>

                            {/* Warning description */}
                            <p className="text-sm text-[#9AA6A8] leading-relaxed mb-5">
                                Please be sure that you have access to the new email address, as it will be used for account recovery and important notifications.
                            </p>

                            {/* Confirm label */}
                            <div className="flex flex-col gap-4 w-full">
                                <div className="w-full">
                                    <label className="font-semibold text-[#9AA6A8] text-sm" >
                                        Old Email
                                    </label>
                                    <div className={`${INPUT_BOX_NO_ICON_STYLE} w-full`}>
                                        {form.email}
                                    </div>
                                </div>

                                <div className="w-full">
                                    <label className="font-semibold text-[#9AA6A8] text-sm" >
                                        New Email
                                    </label>
                                    <input
                                        type="text"
                                        className={`${INPUT_BOX_NO_ICON_STYLE} w-full`}
                                        placeholder="you@company.com"
                                        value={formEmail.newEmail}
                                        onChange={(e) => setFormEmail({ ...formEmail, newEmail: e.target.value })}
                                    />
                                    {errorsEmail.used && <p className="text-[#FE3B46] text-sm font-md italic">This email is already associated with another account</p>}
                                </div>

                                <div className="w-full">
                                    <label className="font-semibold text-[#9AA6A8] text-sm" >
                                        Confirm New Email
                                    </label>
                                    <input
                                        type="text"
                                        className={`${INPUT_BOX_NO_ICON_STYLE} w-full`}
                                        placeholder="you@company.com"
                                        value={formEmail.confirmNewEmail}
                                        onChange={(e) => setFormEmail({ ...formEmail, confirmNewEmail: e.target.value })}
                                    />
                                    {errorsEmail.notMatch && <p className="text-[#FE3B46] text-sm font-md italic">New email and confirm new email do not match</p>}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setOpenEmailModal(false)}
                                    className={`${FILTER_BUTTON_STYLE} disabled:opacity-50`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmEmailChange}
                                    className={`${GREEN_BUTTON_STYLE} disabled:cursor-not-allowed disabled:opacity-40`}
                                >
                                    Confirm Change
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Password Modal */}
            {openPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border-[2px] border-[#2D2F39] border-t-0 bg-[#1E2429] shadow-2xl overflow-hidden relative">

                        {/* Top danger strip */}
                        <div className="h-0.5 w-full bg-[#8FFF9C]" />

                        {/* X */}
                        <button
                            onClick={() => setOpenPasswordModal(false)}
                            className="rounded-lg p-1.5 text-[#9AA6A8] transition-colors hover:text-[#FBFBFB] absolute top-2 right-2"
                        >
                            <Close fontSize="small" />
                        </button>

                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3 text-[#8FFF9C]">
                                    <WarningAmber sx={{ fontSize: 28 }} />
                                    <h2 className="font-bold text-xl leading-tight text-[#8FFF9C]">
                                        Change Password
                                    </h2>
                                </div>
                            </div>

                            {/* Warning description */}
                            <p className="text-sm text-[#9AA6A8] leading-relaxed mb-5">
                                Make sure your new password is at least 8 characters long.
                            </p>

                            {/* Confirm label */}
                            <div className="flex flex-col gap-4 w-full">
                                <div className="w-full">
                                    <label className="font-semibold text-[#9AA6A8] text-sm" >
                                        Current Password
                                    </label>
                                    <input
                                        type="text"
                                        className={`${INPUT_BOX_NO_ICON_STYLE} w-full`}
                                        placeholder=""
                                        value={formPassword.currentPassword}
                                        onChange={(e) => setFormPassword({ ...formPassword, currentPassword: e.target.value })}
                                    />
                                    {errorsPassword.incorrect && <p className="text-[#FE3B46] text-sm font-md italic">Current password is incorrect</p>}
                                </div>

                                <div className="w-full">
                                    <label className="font-semibold text-[#9AA6A8] text-sm" >
                                        New Password
                                    </label>
                                    <input
                                        type="text"
                                        className={`${INPUT_BOX_NO_ICON_STYLE} w-full`}
                                        placeholder=""
                                        value={formPassword.newPassword}
                                        onChange={(e) => setFormPassword({ ...formPassword, newPassword: e.target.value })}
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="font-semibold text-[#9AA6A8] text-sm" >
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="text"
                                        className={`${INPUT_BOX_NO_ICON_STYLE} w-full`}
                                        placeholder=""
                                        value={formPassword.confirmNewPassword}
                                        onChange={(e) => setFormPassword({ ...formPassword, confirmNewPassword: e.target.value })}
                                    />
                                    {errorsPassword.notMatch && <p className="text-[#FE3B46] text-sm font-md italic">New password and confirm new password do not match</p>}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setOpenPasswordModal(false)}
                                    className={`${FILTER_BUTTON_STYLE} disabled:opacity-50`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmPasswordChange}
                                    className={`${GREEN_BUTTON_STYLE} disabled:cursor-not-allowed disabled:opacity-40`}
                                >
                                    Confirm Change
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
