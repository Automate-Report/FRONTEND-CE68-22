"use client";
import { useRouter, useParams } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { useGetScheduleByID } from "@/src/hooks/schedule/use-getScheduleByID";
import { useState, useEffect } from "react";

//components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { getDisplayDate } from "@/src/components/Common/GetDisplayDate";
import { getDisplayTime } from "@/src/components/Common/GetDisplayTime";
import ToggleSwitch from "@/src/components/Common/ToggleSwitch";
import GenericDropdown from "@/src/components/Common/GenericDropdown";

//icons
import AddTime from "@/src/components/icon/AddTime";
import Delete from "@/src/components/icon/Delete";
import Edit from "@/src/components/icon/Edit";
import AddSymbol from "@/src/components/icon/AddSymbol";
import { set } from "react-hook-form";

export default function EditSchedulePage() {

    const router = useRouter();
    const params = useParams<{ id: string; scheduleId: string }>();
    const projectId = parseInt(params.id);
    const scheduleId = parseInt(params.scheduleId);

    // fetching
    const { data: project } = useProject(projectId);
    const { data: schedule } = useGetScheduleByID(scheduleId);

    //states
    const [endDate, setEndDate] = useState(`${schedule?.end_date ? getDisplayDate(new Date(schedule.end_date)) : "dd-mm-yyyy"}`);
    const [startDate, setStartDate] = useState(`${schedule?.start_date ? getDisplayDate(new Date(schedule.start_date)) : "dd-mm-yyyy"}`);
    const [startTime, setStartTime] = useState(`${schedule?.start_date ? getDisplayTime(new Date(schedule.start_date)) : "hh:mm"}`);
    const [repeatTrue, setRepeatTrue] = useState(false);
    const [cronTimes, setCronTimes] = useState<Array<{ min: string; hr: string; day: string; month: string; week: string }>>([]);
    const [days, setDays] = useState([
        { name: "Sun", active: false },
        { name: "Mon", active: false },
        { name: "Tue", active: false },
        { name: "Wed", active: false },
        { name: "Thu", active: false },
        { name: "Fri", active: false },
        { name: "Sat", active: false }
    ]);
    const [monthly, setMonthly] = useState<number[]>([]);
    const [lengthError, setLengthError] = useState<boolean>(false);

    const dayOptions = [
        { label: "Delete", value: 0 },
        ...Array.from({ length: 31 }, (_, i) => ({
            label: String(i + 1),
            value: i + 1,
        }))];

    // Cron parsing
    useEffect(() => {
        const cronList = "0 0 * * *Z30 6 * * *".split("Z");

        const parsed = cronList.map(cron => {
            const [min, hr, day, month, week] = cron.split(" ");
            return { min, hr, day, month, week };
        });

        setCronTimes(parsed);

        // Set active days based on cron's week field
        const week = parsed[0]?.week;
        if (!week) return;
        if (week === "*") {
            setDays(prev => prev.map(d => ({ ...d, active: false })));
        } else {
            const activeDays = week.split(",").map(Number);
            setDays(prev =>
                prev.map((d, i) => ({
                    ...d,
                    active: activeDays.includes(i),
                }))
            );
        }

        // Set monthly date
        const monthly = parsed[0]?.day;
        if (monthly === "*") {
            setMonthly([]);
        }
        else {
            setMonthly(monthly.split(",").map(Number));
        }

    }, []);

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
        { label: schedule?.schedule_name || "Loading...", href: `/projects/${projectId}/schedule/${scheduleId}` },
        { label: "Edit", href: undefined }
    ];

    //will use modal later
    const handleDelete = async () => {
        if (!schedule) return;
        try {
            alert(`Deleting schedule: ${schedule.schedule_name} (Just test message, wont delete fr.)`);
            router.push(`/projects/${projectId}/schedule`);
        } catch (error) {
            console.error("Failed to delete schedule:", error);
        }
    };

    return (
        <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl">

            {/* Section 1: Breadcrumbs */}
            <div className="w-full">
                <GenericBreadcrums items={breadcrumbItems} />
            </div>

            {/* Section 2: Detail Boxes */}
            <div className="flex flex-col gap-6">

                {/* Schedule Name */}
                <div className="flex flex-col w-[40%] gap-3">
                    <span className="font-semibold text-2xl">Schedule Name</span>
                    <input type="text" value={schedule?.schedule_name || "Loading..."} readOnly
                        className="bg-[#FBFBFB] rounded-lg px-4 py-2 text-[#404F57] focus:outline-none" />
                </div>
                {/* Attack Type */}
                <div className="flex flex-col w-[40%] gap-3">
                    <span className="font-semibold text-2xl">Attack Type </span>
                    <input type="text" value={schedule?.attack_type || "Loading..."} readOnly
                        className="bg-[#FBFBFB] rounded-lg px-4 py-2 text-[#404F57] focus:outline-none" />
                </div>
                {/* Asset */}
                <div className="flex flex-col w-[40%] gap-3">
                    <span className="font-semibold text-2xl">Asset </span>
                    <input type="text" value={schedule?.asset_id || "Loading..."} readOnly
                        className="bg-[#FBFBFB] rounded-lg px-4 py-2 text-[#404F57] focus:outline-none" />
                </div>
                {/* Schedule Time */}
                <div className="flex flex-col gap-4">
                    <span className="font-semibold text-2xl">Schedule Time</span>

                    <div className="flex flex-col gap-6">
                        {/* Start At */}
                        <div className="flex flex-row w-full gap-3 items-center justify-start">
                            <span className="font-medium">Start Date: </span>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                className="bg-[#FBFBFB] rounded-lg px-4 py-2 text-[#404F57] focus:outline-none" />
                            <span className="font-medium">At</span>
                            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
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
                                                        <button onClick={() => handleDeleteTime(index)}>
                                                            <Delete />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button className="cursor-pointer bg-[#8FFF9C] rounded-lg px-4 py-2 text-[#0B0F12] font-medium 
                                            focus:outline-none flex flex-row gap-3 items-center w-fit hover:bg-[#AFFFB9]"
                                                onClick={handleAddTime}>
                                                <span>Add Time</span> <AddTime />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Weekly */}
                                    <div className="flex flex-row gap-3 items-center">
                                        <span className="font-medium">Weekly:</span>
                                        {days.map((day, i) => (
                                            <button
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
                                                            width="[90px]"
                                                        />

                                                        {index < monthly.length - 1 && (
                                                            <span className="font-medium">and</span>
                                                        )}
                                                    </div>
                                                ))}
                                                <button className="cursor-pointer bg-[#8FFF9C] rounded-lg px-4 py-2 text-[#0B0F12] font-medium 
                                                        focus:outline-none flex flex-row gap-3 items-center w-fit hover:bg-[#AFFFB9]"
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

                                    {/* Repeat Until */}
                                    <div className="flex flex-row gap-3 items-center">
                                        <span className="font-medium">Repeat Until:</span>
                                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                            className="bg-[#FBFBFB] rounded-lg px-4 py-2 text-[#404F57] focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}