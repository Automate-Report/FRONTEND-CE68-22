"use client";
import { useRouter, useParams } from "next/navigation";
import { useProject } from "@/src/hooks/project/use-project";
import { useGetScheduleByID } from "@/src/hooks/schedule/use-getScheduleByID";
import { useState, useEffect } from "react";
import { ScheduleCreatePayload } from "@/src/types/schedule";
import { scheduleService } from "@/src/services/schedule.service";
import { useGetAllAssetNames } from "@/src/hooks/asset/use-getAllNames";
import { useProjectRole } from "@/src/context/ProjectDetailConext";

//components
import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";
import { getDisplayDate } from "@/src/components/Common/GetDisplayDate";
import { getDisplayTime } from "@/src/components/Common/GetDisplayTime";
import ToggleSwitch from "@/src/components/Common/ToggleSwitch";
import GenericDropdown from "@/src/components/Common/GenericDropdown";

//icons
import AddTime from "@/src/components/icon/AddTime";
import DeleteProjectIcon from "@/src/components/icon/Delete";
import { INPUT_BOX_NO_ICON_STYLE } from "@/src/styles/inputBoxStyle";
import { GREEN_BUTTON_STYLE, RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";
import { start } from "repl";
import RobotIcon from "@/src/components/icon/RobotIcon";
import { Check } from "@mui/icons-material";

export default function EditSchedulePage() {
    const { role } = useProjectRole();
    const router = useRouter();
    const params = useParams<{ id: string; scheduleId: string }>();
    const projectId = parseInt(params.id);
    const scheduleId = parseInt(params.scheduleId);

    useEffect(() => {
        if (role?.toLowerCase() === "developer") {
            router.replace(`/projects/${projectId}/overview`);
        }
    }, [role, projectId, router]);

    // fetching
    const { data: project, isLoading, isError } = useProject(projectId);
    const { data: schedule } = useGetScheduleByID(scheduleId);
    const { data: allAssetName } = useGetAllAssetNames(projectId);

    // States
    const timeLimit = 7;
    const [form, setForm] = useState({
        scheduleName: "",
        attackType: [] as string[],
        assetId: 0,
        startDate: "",
        startTime: "",
        endDate: "",
    });
    const [repeatTrue, setRepeatTrue] = useState(schedule?.cron_expression == "Not Repeat" ? false : true);
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
    const [dayOfMonth, setDayOfMonth] = useState(
        Array.from({ length: 31 }, (_, i) => ({
            name: String(i + 1),
            active: false,
        }))
    );

    // Error states
    const [errors, setErrors] = useState({ name: false, attackType: false});
    const [timeError, setTimeError] = useState({ repeat: false, limit: false });
    const [invalidDateError, setInvalidDateError] = useState({ start: false, end: false });

    // Dropdown Options
    const assetOptions = allAssetName ? allAssetName.map(asset => ({
        label: asset?.name,
        value: asset?.id,
    })) : [];

    // Assign init value to states
    useEffect(() => {
        if (!schedule) return;

        setForm({
            scheduleName: schedule.schedule_name,
            attackType: schedule.attack_type == "all" ? ["sqli", "xss"] : [schedule.attack_type],
            assetId: schedule.asset_id,
            startDate: getDisplayDate(new Date(schedule.start_date), "input"),
            startTime: getDisplayTime(new Date(schedule.start_date)),
            endDate: schedule.end_date
                ? getDisplayDate(new Date(schedule.end_date), "input")
                : "",
        });

    }, [schedule]);

    // Fetched cron parsing
    useEffect(() => {
        let cronList = schedule?.cron_expression.split("Z") || ["0 0 * * *"];
        if (schedule?.cron_expression == "Not Repeat") {
            cronList = ["0 0 * * *"];
        }
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
            setDayOfMonth(prev => prev.map(d => ({ ...d, active: false })));
        }
        else {
            setDayOfMonth(prev => prev.map((d, i) => ({
                ...d,
                active: monthly.split(",").map(Number).includes(i + 1)
            })));
        }

    }, [schedule]);

    const handleAddTime = () => {
        if (cronTimes.length >= timeLimit) {
            setTimeError(prev => ({ ...prev, limit: true }));
            return;
        }
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

        setTimeError({ repeat: false, limit: false });

        // If not repeat
        if (!repeatTrue) {
            return "Not Repeat";
        }

        // Check for repeated times
        const timeSet = new Set(cronTimes.map(t => `${t.hr}:${t.min}`));
        if (timeSet.size !== cronTimes.length) {
            setTimeError(prev => ({ ...prev, repeat: true }));
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
            day: dates === "" || dates === "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31" ? "*" : dates,
            month,
            week: week === "" || week === "0,1,2,3,4,5,6" ? "*" : week
        }));

        const cronString = allCronExpression
            .map(({ min, hr, day, month, week }) => `${min} ${hr} ${day} ${month} ${week}`)
            .join("Z");

        return cronString;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({ name: false, attackType: false});
        setInvalidDateError({ start: false, end: false });
        let hasError = false;

        // Check if start date is in the past
        const startDateTime = new Date(`${form.startDate}T${form.startTime}:00`);
        if (startDateTime < new Date()) {
            setInvalidDateError(prev => ({ ...prev, start: true }));
            hasError = true;
        }

        // If repeat is true, check if end date is after start date
        if (repeatTrue && form.endDate) {
            const endDateTime = new Date(form.endDate);
            if (endDateTime <= startDateTime) {
                setInvalidDateError(prev => ({ ...prev, end: true }));
                hasError = true;
            }
        }

        // Check if schedule name is empty
        if (!form.scheduleName.trim()) {
            setErrors(prev => ({ ...prev, name: true }));
            hasError = true;
        }

        // Check if attack type is selected
        if (form.attackType.length === 0) {
            setErrors(prev => ({ ...prev, attackType: true }));
            hasError = true;
        }

        //Check if all error is solved
        if (hasError) {
            return;
        }

        const cronString = changeUserInputToCronString();
        if (!cronString) return;
        const finalAtkType = form.attackType.length === 2 ? "all" : form.attackType[0];
        const payload: ScheduleCreatePayload = {
            project_id: projectId,
            name: form.scheduleName,
            atk_type: finalAtkType,
            asset: form.assetId,
            cron_expression: cronString,
            start_date: new Date(`${form.startDate}T${form.startTime}:00`),
            end_date: (!repeatTrue || form.endDate) ? new Date(form.startDate) : new Date(form.endDate),
        };
        const data = await scheduleService.edit(scheduleId, payload);
        router.push(`/projects/${projectId}/schedule/${scheduleId}`);
    }

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError || !project) return <div className="p-8 text-red-500">Project not found</div>;

    const breadcrumbItems = [
        { label: "Home", href: "/main" },
        { label: project?.name || "Loading...", href: `/projects/${projectId}/overview` },
        { label: "Schedule", href: `/projects/${projectId}/schedule` },
        { label: schedule?.schedule_name || "Loading...", href: `/projects/${projectId}/schedule/${scheduleId}` },
        { label: "Edit", href: undefined }
    ];

    const attackType = [
        { display: "SQL Injection", value: "sqli", desc: "Manipulate database queries through input." },
        { display: "Cross-site Scripting", value: "xss", desc: " Inject malicious scripts into web pages." }
    ];

    return (
        <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl">

            {/* Section 1: Breadcrumbs */}
            <div className="w-full">
                <GenericBreadcrums items={breadcrumbItems} />
            </div>

            <form onSubmit={handleSubmit}>

                {/* Section 2: Detail Boxes */}
                <div className="px-[10vw] flex flex-col gap-6 mt-5">
                    <div className="flex flex-col gap-6">
                        <div className="bg-[#151B1D] px-10 py-8 border-2 rounded-4xl border-[#1E2A30] flex flex-col gap-6">
                            <p className="font-semibold text-[#E6F0E6] text-xl ">
                                Edit General Schedule's Information
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="w-full">
                                    <label className="font-semibold text-[#9AA6A8] text-sm" >
                                        Schedule's Name
                                    </label>
                                    <input
                                        type="text"
                                        className={`${INPUT_BOX_NO_ICON_STYLE} w-full`}
                                        placeholder="e.g., Weekly Security Audit"
                                        value={form.scheduleName}
                                        onChange={(e) => setForm({ ...form, scheduleName: e.target.value })}
                                    />
                                    {errors.name && <p className="text-[#FE3B46] text-sm font-md italic">Schedule name is required</p>}
                                </div>
                                <div className="w-full">
                                    <label className="font-semibold text-[#9AA6A8] text-sm" >
                                        Assets
                                    </label>
                                    <GenericDropdown<number>
                                        options={assetOptions}
                                        value={form.assetId}
                                        placeholder="Asset"
                                        onChange={(newValue) => setForm({ ...form, assetId: newValue })}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="bg-[#151B1D] px-10 py-8 border-2 rounded-4xl border-[#1E2A30] flex flex-col gap-6">
                            <label className="font-semibold text-[#E6F0E6] text-xl"> Edit Attack Type</label>
                            <div className="flex justify-between w-full gap-[32px]">
                                {attackType.map((item, index) => {
                                    const selectedList = Array.isArray(form.attackType) ? form.attackType : [];
                                    const isSelected = selectedList.includes(item.value);

                                    const handleToggle = () => {
                                        // Can multi select
                                        let newList: string[] = [];
                                        if (isSelected) {
                                            newList = selectedList.filter(value => value !== item.value);
                                        } else {
                                            newList = [...selectedList, item.value];
                                        }
                                        setForm({ ...form, attackType: newList });
                                    };

                                    return (
                                        <div
                                            key={index}
                                            onClick={handleToggle}
                                            className={`flex gap-4 p-4 w-full cursor-pointer border-2 rounded-lg transition-all duration-300 active:scale-[0.98]
                                                                        ${isSelected
                                                    ? "bg-[#1E2429] border-[#8FFF9C] shadow-[0_0_20px_rgba(143,255,156,0.15)]"
                                                    : "bg-[#0F1518] border-[#404F57] hover:border-[#667a85]"
                                                }`}
                                        >
                                            {/* Icon Box */}
                                            <div className={`p-4 rounded-xl transition-colors duration-300 
                                                                        ${isSelected
                                                    ? "bg-[#8FFF9C] text-[#0D1014] border-[#8FFF9C]"
                                                    : "bg-[#404F57] text-[#E6F0E6] border-transparent"
                                                }`}>

                                                {/* ถ้าเลือกอยู่ ให้โชว์ Checkmark ถ้าไม่เลือกให้โชว์ RobotIcon */}
                                                {isSelected ? (
                                                    <div className="w-8 h-8 flex items-center justify-center animate-in zoom-in duration-300">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <RobotIcon className="w-8 h-8" />
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1 justify-center">
                                                <p className={`text-xl font-bold transition-colors 
                                                                            ${isSelected ? "text-[#8FFF9C]" : "text-[#FBFBFB]"}`}>
                                                    {item.display}
                                                </p>
                                                <p className="text-[13px] font-light text-[#E6F0E6]">
                                                    {item.desc}
                                                </p>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                            {errors.attackType && <p className="text-[#FE3B46] text-sm font-md italic text-center">Please select an attack type</p>}
                        </div>
                    </div>
                    <div className="animate-in fade-in duration-500 space-y-8">
                        <div className="bg-[#151B1D] px-10 py-8 border-2 rounded-4xl border-[#1E2A30] flex flex-col gap-6">

                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-[#E6F0E6] text-xl">Edit Schedule’s Frequency</h3>
                            </div>

                            {/* --- Schedule Time Settings (เดิมของคุณ แต่เพิ่ม logic หรี่ไฟเมื่อ runNow=true) --- */}
                            <div className={`flex flex-col gap-2 transition-all duration-500`}>
                                <div className="flex flex-col gap-6">
                                    {/* Start At */}
                                    <div className="flex flex-row w-full gap-6 items-end">
                                        <div className="flex-1">
                                            <label className="font-semibold text-[#9AA6A8] text-sm" >
                                                Start Date
                                            </label>
                                            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                                className={`${INPUT_BOX_NO_ICON_STYLE} w-full`} />
                                        </div>
                                        <div className="flex flex-col items-center justify-center pb-2 text-[#404F57] font-black italic">AT</div>
                                        <div className="flex-1">
                                            <label className="font-semibold text-[#9AA6A8] text-sm" >
                                                Start Time
                                            </label>
                                            <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                                className={`${INPUT_BOX_NO_ICON_STYLE} w-full`} />
                                        </div>
                                    </div>
                                    {invalidDateError.start && (
                                        <span className="text-red-500 mt-[-15px]">Start date and time cannot be in the past.</span>
                                    )}

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
                                                                    className={`${INPUT_BOX_NO_ICON_STYLE} pr-3`}
                                                                />

                                                                {cronTimes.length > 1 && (
                                                                    <button type="button" onClick={() => handleDeleteTime(index)}>
                                                                        <DeleteProjectIcon />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <button className={`w-[150px] whitespace-nowrap ${GREEN_BUTTON_STYLE}`}
                                                            type="button"
                                                            onClick={handleAddTime}>
                                                            Add Time <AddTime />
                                                        </button>
                                                        {timeError.repeat && (
                                                            <span className="text-red-500">You cannot specify the same time more than once.</span>
                                                        )}
                                                        {timeError.limit && (
                                                            <span className="text-red-500">You can only have up to 7 different times</span>
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
                                                                            ? "border-[2px] border-[#8FFF9C]/0 bg-[#8FFF9C] text-[#0B0F12] hover:shadow-[0_0_18px_rgba(34,197,94,0.9)]"
                                                                            : "border-[2px] border-[#404F57] text-[#404F57] hover:bg-[#404F57] hover:text-[#E6F0E6]"
                                                                        }`}
                                                                >
                                                                    {day.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <div className="flex flex-row gap-3">
                                                            <button className={GREEN_BUTTON_STYLE}
                                                                type="button"
                                                                onClick={handleAddAllWeek}>
                                                                <span>Set Everyday</span>
                                                            </button>
                                                            <button className={RED_BUTTON_STYLE}
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
                                                                            ? "border-[2px] border-[#8FFF9C]/0 bg-[#8FFF9C] text-[#0B0F12] hover:shadow-[0_0_18px_rgba(34,197,94,0.9)]"
                                                                            : "border-[2px] border-[#404F57] text-[#404F57] hover:bg-[#404F57] hover:text-[#E6F0E6]"
                                                                        }`}
                                                                >
                                                                    {day.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <div className="flex flex-row gap-3">
                                                            <button className={GREEN_BUTTON_STYLE}
                                                                type="button"
                                                                onClick={handleAddAllDate}>
                                                                <span>Set Everyday</span>
                                                            </button>
                                                            <button className={RED_BUTTON_STYLE}
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
                                                        className={`${INPUT_BOX_NO_ICON_STYLE} pr-3`} />
                                                </div>
                                                {invalidDateError.end && (
                                                    <span className="text-red-500 ml-28 mt-[-20px]">End date must be after start date. Please select a valid end date.</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-[10vw] flex gap-6 items-center mt-[30px] justify-between">
                    <button className={`${RED_BUTTON_STYLE} w-full justify-center`}
                        type="button" onClick={() => router.push(`/projects/${projectId}/schedule/${scheduleId}`)}>Cancel</button>

                    <button className={`${GREEN_BUTTON_STYLE} w-full`}
                        type="submit">Save Changes</button>
                </div>

            </form>
        </div>
    );
}