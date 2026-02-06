"use client";
import { useRouter, useParams } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { useState } from "react";
import { ScheduleCreatePayload } from "@/src/types/schedule";

//components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import ToggleSwitch from "@/src/components/Common/ToggleSwitch";
import GenericDropdown from "@/src/components/Common/GenericDropdown";

//icons
import AddTime from "@/src/components/icon/AddTime";
import Delete from "@/src/components/icon/Delete";
import Edit from "@/src/components/icon/Edit";
import AddSymbol from "@/src/components/icon/AddSymbol";

export default function EditSchedulePage() {

    const router = useRouter();
    const params = useParams<{ id: string; scheduleId: string }>();
    const projectId = parseInt(params.id);

    // fetching
    const { data: project, isLoading, isError } = useProject(projectId);

    // States
    const [form, setForm] = useState({
        scheduleName: "",
        attackType: "",
        assetId: 0,
        startDate: "",
        startTime: "",
        endDate: "",
    });
    const [repeatTrue, setRepeatTrue] = useState(false);
    const [cronTimes, setCronTimes] = useState<Array<{ min: string; hr: string; day: string; month: string; week: string }>>([
        { min: "0", hr: "0", day: "*", month: "*", week: "*" }
    ]);
    const [monthly, setMonthly] = useState<number[]>([]);
    const [days, setDays] = useState([
        { name: "Sun", active: false },
        { name: "Mon", active: false },
        { name: "Tue", active: false },
        { name: "Wed", active: false },
        { name: "Thu", active: false },
        { name: "Fri", active: false },
        { name: "Sat", active: false }
    ]);

    // Error states
    const [lengthError, setLengthError] = useState<boolean>(false);
    const [repeatedDayError, setRepeatedDayError] = useState<boolean>(false);
    const [repeatedTimeError, setRepeatedTimeError] = useState<boolean>(false);

    // Dropdown Options
    const dayOptions = [
        { label: "Delete", value: 0 },
        ...Array.from({ length: 31 }, (_, i) => ({
            label: String(i + 1),
            value: i + 1,
        }))];

    const attackTypeOptions = [
        { label: "SQL Injection", value: "SQL Injection" },
        { label: "XSS", value: "XSS" },
    ];

    const assetOptions = [
        { label: "Asset 1", value: 5001 },
        { label: "Asset 2", value: 5002 },
        { label: "Asset 3", value: 5003 },
        { label: "Asset 4", value: 5004 },
        { label: "Asset 5", value: 5005 },
        { label: "Asset 6", value: 5006 },
        { label: "Asset 7", value: 5007 },
        { label: "Asset 8", value: 5008 },
    ];

    const handleAddMonthly = () => {
        // limit to 5 dates
        if (monthly.length >= 5) {
            setLengthError(true);
            return;
        }
        setMonthly(prev => [...prev, 1]);
        setLengthError(false);
    }

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

    const breadcrumbItems = [
        { label: "Home", href: "/main" },
        { label: project?.name || "Loading...", href: `/projects/${projectId}/overview` },
        { label: "Schedule", href: `/projects/${projectId}/schedule` },
        { label: "Create", href: undefined }
    ];

    const changeUserInputToCronString = (month: string = "*") => {

        // Check for repeated days
        if (new Set(monthly).size !== monthly.length) {
            setRepeatedDayError(true);
            return;
        }
        setRepeatedDayError(false);

        // Check for repeated times
        const timeSet = new Set(cronTimes.map(t => `${t.hr}:${t.min}`));
        if (timeSet.size !== cronTimes.length) {
            setRepeatedTimeError(true);
            return;
        }
        setRepeatedTimeError(false);

        // Week string from active days
        const week = days
            .reduce<number[]>((newArray, day, index) => {
                if (day.active) newArray.push(index);
                return newArray;
            }, [])
            .join(",");

        const allCronExpression = cronTimes.map(({ hr, min }) => ({
            min,
            hr,
            day: monthly.length ? monthly.join(",") : "*",
            month,
            week: week === "" ? "*" : week
        }));

        const cronString = allCronExpression
            .map(({ min, hr, day, month, week }) => `${min} ${hr} ${day} ${month} ${week}`)
            .join("Z");

        console.log("Schedule - edit - showcron :", cronString);
        return cronString;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLengthError(false);
        const cronString = changeUserInputToCronString();
        if (!cronString) return;
        const payload: ScheduleCreatePayload = {
            project_id: projectId,
            name: form.scheduleName,
            atk_type: form.attackType,
            asset: form.assetId,
            cron_expression: cronString,
            start_date: new Date(`${form.startDate}T${form.startTime}:00`),
            end_date: form.endDate ? new Date(form.endDate) : null,
        };
        alert("Schedule - edit - payload :" + JSON.stringify(payload));
    }

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

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
                                    <div className="flex flex-col gap-4">

                                        {/* Run At */}
                                        <div className="flex flex-row gap-3">
                                            <span className="font-medium mt-2">Run At:</span>

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
                                                                <Delete />
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
                                        <div className="flex flex-row gap-3 items-center">
                                            <span className="font-medium">Weekly:</span>
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

                                        {/* Monthly */}
                                        <div className="flex flex-wrap gap-3 items-center w-full">
                                            <span className="font-medium">Monthly:</span>
                                            {monthly.length === 0 ? (
                                                <>
                                                    <input type="text" value="Every day of the month" readOnly
                                                        className="bg-[#272D31] rounded-lg px-4 py-2 text-[#E6F0E6] focus:outline-none" />
                                                    <button className="cursor-pointer bg-[#8FFF9C] rounded-lg px-4 py-2 text-[#0B0F12] font-medium 
                                                            focus:outline-none flex flex-row gap-3 items-center w-fit hover:bg-[#AFFFB9]"
                                                        type="button"
                                                        onClick={handleAddMonthly}>
                                                        <span>Specify Date</span> <Edit />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {monthly.map((date, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <GenericDropdown<number>
                                                                options={dayOptions}
                                                                value={date}
                                                                placeholder="Day"
                                                                onChange={(newValue) => {
                                                                    setMonthly(prev => {
                                                                        // remove value if Delete is selected
                                                                        if (newValue === 0) {
                                                                            return prev.filter((_, i) => i !== index);
                                                                        }
                                                                        // update value
                                                                        return prev.map((d, i) =>
                                                                            i === index ? newValue : d
                                                                        );
                                                                    });
                                                                }}
                                                                width="[100px]"
                                                            />

                                                            {index < monthly.length - 1 && (
                                                                <span className="font-medium">and</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button className="cursor-pointer bg-[#8FFF9C] rounded-lg px-4 py-2 text-[#0B0F12] font-medium 
                                                            focus:outline-none flex flex-row gap-3 items-center w-fit hover:bg-[#AFFFB9]"
                                                        type="button"
                                                        onClick={handleAddMonthly}>
                                                        <AddSymbol />
                                                    </button>
                                                    <span className="font-medium">of every month</span>
                                                </>
                                            )}
                                        </div>
                                        {lengthError && (
                                            <span className="text-red-500">You can specify up to 5 dates only.</span>
                                        )}
                                        {repeatedDayError && (
                                            <span className="text-red-500">You cannot specify the same date more than once.</span>
                                        )}

                                        {/* Repeat Until */}
                                        <div className="flex flex-row gap-3 items-center">
                                            <span className="font-medium">Repeat Until:</span>
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
                                    type="submit">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>


            </form>
        </div>
    );
}