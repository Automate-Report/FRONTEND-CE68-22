"use client";
import { useRouter, useParams } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { useState } from "react";
import { ScheduleCreatePayload } from "@/src/types/schedule";
import { getDisplayDate } from "@/src/components/Common/GetDisplayDate";
import { getDisplayTime } from "@/src/components/Common/GetDisplayTime";
import { scheduleService } from "@/src/services/schedule.service";
import { useGetAllAssetNames } from "@/src/hooks/asset/use-getAllNames";

//components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import ToggleSwitch from "@/src/components/Common/ToggleSwitch";
import GenericDropdown from "@/src/components/Common/GenericDropdown";

//icons
import AddTime from "@/src/components/icon/AddTime";
import DeleteProjectIcon from "@/src/components/icon/Delete";
import { Tooltip } from "@mui/material";

export default function EditSchedulePage() {

    const router = useRouter();
    const params = useParams<{ id: string; scheduleId: string }>();
    const projectId = parseInt(params.id);

    // fetching
    const { data: project, isLoading, isError } = useProject(projectId);
    const { data: allAssetName } = useGetAllAssetNames(projectId);

    // States
    const [runNow, setRunNow] = useState(false);
    const [form, setForm] = useState({
        scheduleName: "",
        attackType: "",
        assetId: 0,
        startDate: getDisplayDate(new Date(), "input"),
        startTime: getDisplayTime(new Date(Date.now() + 3600 * 1000)), // default = next hour
        endDate: "",
    });
    const [repeatTrue, setRepeatTrue] = useState(false);
    const [cronTimes, setCronTimes] = useState<Array<{ min: string; hr: string; day: string; month: string; week: string }>>([
        { min: "0", hr: "0", day: "*", month: "*", week: "*" }
    ]);
    const [days, setDays] = useState([
        { name: "Sun", active: false },
        { name: "Mon", active: false },
        { name: "Tue", active: false },
        { name: "Wed", active: false },
        { name: "Thu", active: false },
        { name: "Fri", active: false },
        { name: "Sat", active: false }
    ]);
    const [dayOfMonth, setDayOfMonth] = useState(
        Array.from({ length: 31 }, (_, i) => ({
            name: String(i + 1),
            active: false,
        }))
    );

    // Error states
    const [nameError, setNameError] = useState<boolean>(false);
    const [attackTypeError, setAttackTypeError] = useState<boolean>(false);
    const [assetError, setAssetError] = useState<boolean>(false);
    const [repeatedTimeError, setRepeatedTimeError] = useState<boolean>(false);

    // Dropdown Options
    const attackTypeOptions = [
        { label: "SQL Injection", value: "SQL Injection" },
        { label: "XSS", value: "XSS" },
    ];

    const assetOptions = allAssetName ? allAssetName.map(asset => ({
        label: asset?.name,
        value: asset?.id,
    })) : [];

    const handleAddTime = () => {
        setCronTimes(prev => [...prev,
        {
            min: "0",
            hr: "0",
            day: prev[0].day,
            month: prev[0].month,
            week: prev[0].week,
        }
        ]);
    };
    const handleDeleteTime = (indexToRemove: number) => {
        setCronTimes(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const toggleDay = (index: number) => {
        setDays(prev =>
            prev.map((d, i) =>
                i === index ? { ...d, active: !d.active } : d
            )
        );
    };

    const handleAddAllWeek = () => {
        setDays(prev => prev.map(d => ({ ...d, active: true })));
    }

    const handleClearAllWeek = () => {
        setDays(prev => prev.map(d => ({ ...d, active: false })));
    }

    const toggleDayOfMonth = (index: number) => {
        setDayOfMonth(prev =>
            prev.map((d, i) =>
                i === index ? { ...d, active: !d.active } : d
            )
        );
    };

    const handleAddAllDate = () => {
        setDayOfMonth(prev => prev.map(d => ({ ...d, active: true })));
    }

    const handleClearAllDate = () => {
        setDayOfMonth(prev => prev.map(d => ({ ...d, active: false })));
    }

    const changeUserInputToCronString = (month: string = "*") => {

        setRepeatedTimeError(false);

        // If not repeat
        if (!repeatTrue) {
            return "Not Repeat";
        }

        // Check for repeated times
        const timeSet = new Set(cronTimes.map(t => `${t.hr}:${t.min}`));
        if (timeSet.size !== cronTimes.length) {
            setRepeatedTimeError(true);
            return;
        }

        // Week string from active days
        const week = days
            .reduce<number[]>((newArray, day, index) => {
                if (day.active) newArray.push(index);
                return newArray;
            }, []).join(",");
        
        const dates = dayOfMonth
            .reduce<number[]>((newArray, day, index) => {
                if (day.active) newArray.push(index + 1);
                return newArray;
            }, []).join(",");

        const allCronExpression = cronTimes.map(({ hr, min }) => ({
            min,
            hr,
            day: dates === "" ? "*" : dates,
            month,
            week: week === "" ? "*" : week
        }));

        const cronString = allCronExpression
            .map(({ min, hr, day, month, week }) => `${min} ${hr} ${day} ${month} ${week}`)
            .join("Z");

        return cronString;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //clear errors
        setNameError(false);
        setAttackTypeError(false);
        setAssetError(false);

        const cronString = changeUserInputToCronString();
        if (!cronString) return;

        //error check
        let flagError = false;
        if (form.scheduleName === "") { setNameError(true); flagError = true; }
        if (form.attackType === "") { setAttackTypeError(true); flagError = true; }
        if (!form.assetId || form.assetId === 0) { setAssetError(true); flagError = true; }
        if (flagError) return;

        if (runNow) {
            const payload: ScheduleCreatePayload = {
                project_id: projectId,
                name: form.scheduleName,
                atk_type: form.attackType,
                asset: form.assetId,
                cron_expression: "Not Repeat",
                start_date: new Date(Date.now() + 60 * 1000), // run after 1 minute
                end_date: new Date(Date.now() + 60 * 1000),
            };

            const data = await scheduleService.create(payload);
            router.push(`/projects/${projectId}/schedule`);
            setRunNow(false);
            return
        }

        const payload: ScheduleCreatePayload = {
            project_id: projectId,
            name: form.scheduleName,
            atk_type: form.attackType,
            asset: form.assetId,
            cron_expression: cronString,
            start_date: new Date(`${form.startDate}T${form.startTime}:00`),
            end_date: (!repeatTrue && form.endDate) ? new Date(form.endDate) : new Date(form.startDate),
        };

        const data = await scheduleService.create(payload);
        router.push(`/projects/${projectId}/schedule`);
    }

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

    const breadcrumbItems = [
        { label: "Home", href: "/main" },
        { label: project?.name || "Loading...", href: `/projects/${projectId}/overview` },
        { label: "Schedule", href: `/projects/${projectId}/schedule` },
        { label: "Create", href: undefined }
    ];

    return (
        <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl">

            {/* Section 1: Breadcrumbs */}
            <div className="w-full">
                <GenericBreadcrums items={breadcrumbItems} />
            </div>

            <form onSubmit={handleSubmit}>

                {/* Section 2: Detail Boxes */}
                <div className="flex flex-col gap-6">

                    {/* Schedule Name */}
                    <div className="flex flex-col w-[40%] gap-3">
                        <span className="font-semibold text-2xl">Schedule Name</span>
                        <input type="text" value={form.scheduleName || ""} placeholder="Your Schedule Name"
                            onChange={(e) => setForm({ ...form, scheduleName: e.target.value })}
                            className="bg-[#FBFBFB] rounded-lg px-4 py-2 text-[#404F57] focus:outline-none" />
                        {nameError && (
                            <span className="text-red-500">Please enter a schedule name.</span>
                        )}
                    </div>

                    {/* Attack Type */}
                    <div className="flex flex-col w-[40%] gap-3">
                        <span className="font-semibold text-2xl">Attack Type </span>
                        <GenericDropdown<string>
                            options={attackTypeOptions}
                            value={form.attackType}
                            placeholder="Attack Type"
                            onChange={(newValue) => setForm({ ...form, attackType: newValue })}
                        />
                        {attackTypeError && (
                            <span className="text-red-500">Please select an attack type.</span>
                        )}
                    </div>

                    {/* Asset */}
                    <div className="flex flex-col w-[40%] gap-3">
                        <span className="font-semibold text-2xl">Asset </span>
                        <GenericDropdown<number>
                            options={assetOptions}
                            value={form.assetId}
                            placeholder="Asset"
                            onChange={(newValue) => setForm({ ...form, assetId: newValue })}
                        />
                        {assetError && (
                            <span className="text-red-500">Please select an asset.</span>
                        )}
                    </div>

                    {/* Schedule Time */}
                    <div className="flex flex-col gap-4">
                        <span className="font-semibold text-2xl">Schedule Time</span>

                        <div className="flex flex-col gap-6">
                            {/* Start At */}
                            <div className="flex flex-row w-full gap-3 items-center justify-start">
                                <span className="font-medium">Start Date: </span>
                                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                    className="bg-[#FBFBFB] rounded-lg px-4 py-2 text-[#404F57] focus:outline-none" />
                                <span className="font-medium">At</span>
                                <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                    className="bg-[#FBFBFB] rounded-lg px-4 py-2 text-[#404F57] focus:outline-none" />
                            </div>

                            {/* Repeat Button */}
                            <div className="flex items-center">
                                <ToggleSwitch
                                    initial={repeatTrue}
                                    onChange={(value) => {
                                        setRepeatTrue(value);
                                    }}
                                />
                                <span className="ml-4 font-medium">Repeat</span>
                            </div>

                            {/* Repeat Settings */}
                            {repeatTrue && (
                                <div className="flex flex-row gap-4 pl-6">
                                    <div className="w-[2px] self-stretch bg-gray-300" />
                                    <div className="flex flex-col gap-6">

                                        {/* Run At */}
                                        <div className="flex flex-row gap-3">
                                            <span className="font-medium mt-2 w-[100px]">Run At:</span>

                                            {/* Times */}
                                            <div className="flex flex-col gap-3">
                                                {cronTimes.map((time, index) => (
                                                    <div key={index} className="flex flex-row gap-3 items-center">
                                                        <input
                                                            type="time"
                                                            value={`${String(time.hr).padStart(2, "0")}:${String(time.min).padStart(2, "0")}`}
                                                            onChange={(e) => {
                                                                const [hr, min] = e.target.value.split(":");
                                                                setCronTimes(prev =>
                                                                    prev.map((t, i) =>
                                                                        i === index ? { ...t, hr, min } : t
                                                                    )
                                                                );
                                                            }}
                                                            className="bg-[#FBFBFB] rounded-lg px-4 py-2 text-[#404F57] focus:outline-none"
                                                        />

                                                        {cronTimes.length > 1 && (
                                                            <button type="button" onClick={() => handleDeleteTime(index)}>
                                                                <DeleteProjectIcon />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button className="cursor-pointer bg-[#8FFF9C] rounded-lg px-4 py-2 text-[#0B0F12] font-medium 
                                                focus:outline-none flex flex-row gap-3 items-center w-fit hover:bg-[#AFFFB9]"
                                                    type="button"
                                                    onClick={handleAddTime}>
                                                    <span>Add Time</span> <AddTime />
                                                </button>
                                                {repeatedTimeError && (
                                                    <span className="text-red-500">You cannot specify the same time more than once.</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Weekly */}
                                        <div className="flex flex-row gap-3 items-start">
                                            <span className="font-medium w-[100px] mt-2">Weekly:</span>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex flex-row gap-2">
                                                    {days.map((day, i) => (
                                                        <button
                                                            type="button"
                                                            key={day.name}
                                                            onClick={() => toggleDay(i)}
                                                            className={`cursor-pointer rounded-lg py-2 font-bold w-[60px]
                                                        flex items-center justify-center transition-colors
                                                        ${day.active
                                                                    ? "bg-[#8FFF9C] text-[#0B0F12] hover:bg-[#AFFFB9]"
                                                                    : "bg-[#FBFBFB] text-[#404F57] hover:bg-[#E6F0E6]"
                                                                }`}
                                                        >
                                                            {day.name}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="flex flex-row gap-3">
                                                    <button className="cursor-pointer bg-[#8FFF9C] rounded-lg px-4 py-2 text-[#0B0F12] font-medium 
                                                    focus:outline-none flex flex-row gap-3 items-center w-fit hover:bg-[#AFFFB9]"
                                                        type="button"
                                                        onClick={handleAddAllWeek}>
                                                        <span>Set Everyday</span>
                                                    </button>
                                                    <button className="flex items-center justify-center bg-[#0F1518] border border-[#FE3B46] text-[#FE3B46] text-[16px] 
                                                    font-semibold rounded-lg px-6 py-2 gap-3 cursor-pointer hover:bg-[#FE3B46] hover:text-[#FBFBFB] transition-colors"
                                                        type="button" onClick={handleClearAllWeek}>
                                                        <span>Clear All Week</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Monthly */}
                                        <div className="flex flex-row gap-3 items-start">
                                            <span className="font-medium mt-2 w-[100px]">Monthly:</span>
                                            <div className="flex flex-col gap-3">
                                                <div className="grid grid-cols-7 gap-3 items-center">
                                                    {dayOfMonth.map((day, i) => (
                                                        <button
                                                            type="button"
                                                            key={day.name}
                                                            onClick={() => toggleDayOfMonth(i)}
                                                            className={`cursor-pointer rounded-lg py-2 font-bold w-[60px]
                                                            flex items-center justify-center transition-colors
                                                            ${day.active
                                                                    ? "bg-[#8FFF9C] text-[#0B0F12] hover:bg-[#AFFFB9]"
                                                                    : "bg-[#FBFBFB] text-[#404F57] hover:bg-[#E6F0E6]"
                                                                }`}
                                                        >
                                                            {day.name}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="flex flex-row gap-3">
                                                    <button className="cursor-pointer bg-[#8FFF9C] rounded-lg px-4 py-2 text-[#0B0F12] font-medium 
                                                    focus:outline-none flex flex-row gap-3 items-center w-fit hover:bg-[#AFFFB9]"
                                                        type="button"
                                                        onClick={handleAddAllDate}>
                                                        <span>Set Everyday</span>
                                                    </button>
                                                    <button className="flex items-center justify-center bg-[#0F1518] border border-[#FE3B46] text-[#FE3B46] text-[16px] 
                                                    font-semibold rounded-lg px-6 py-2 gap-3 cursor-pointer hover:bg-[#FE3B46] hover:text-[#FBFBFB] transition-colors"
                                                        type="button" onClick={handleClearAllDate}>
                                                        <span>Clear All Date</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Repeat Until */}
                                        <div className="flex flex-row gap-3 items-center">
                                            <span className="font-medium w-[100px]">Repeat Until:</span>
                                            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                                className="bg-[#FBFBFB] rounded-lg px-4 py-2 text-[#404F57] focus:outline-none" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-8 items-center">
                                <button className="flex items-center justify-center bg-[#0F1518] border border-[#FE3B46] text-[#FE3B46] text-[16px] 
                                        font-semibold rounded-lg px-6 py-2 gap-3 cursor-pointer hover:bg-[#272D31]"
                                    type="button" onClick={() => router.push(`/projects/${projectId}/schedule`)}>Cancel</button>
                                <button className="cursor-pointer bg-[#8FFF9C] rounded-lg px-4 py-2 text-[#0B0F12] font-medium 
                                        focus:outline-none flex flex-row gap-3 items-center w-fit hover:bg-[#AFFFB9]"
                                    type="submit">Create Schedule</button>
                                <span> Or </span>
                                <Tooltip title="Run this schedule immediately once">
                                    <button className="cursor-pointer bg-[#8FFF9C] rounded-lg px-4 py-2 text-[#0B0F12] font-medium 
                                            focus:outline-none flex flex-row gap-3 items-center w-fit hover:bg-[#AFFFB9]
                                            animate-[shadowPulse_1.6s_ease-in-out_infinite]
                                            shadow-[0_0_6px_rgba(34,197,94,0.4)]"
                                        onClick={() => setRunNow(true)}
                                        type="submit">Run NOW !!</button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>


            </form>
        </div>
    );
}