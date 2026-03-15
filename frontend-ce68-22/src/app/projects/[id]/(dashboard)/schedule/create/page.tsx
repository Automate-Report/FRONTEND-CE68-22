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

import ScheduleToggleSwitch from "@/src/components/schedule/ToggleSwitch";

//icons
import AddTime from "@/src/components/icon/AddTime";
import DeleteProjectIcon from "@/src/components/icon/Delete";
import { Tooltip, Box, Typography, Divider } from "@mui/material";
import { GREEN_BUTTON_STYLE, RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";
import { INPUT_BOX_NO_ICON_STYLE } from "@/src/styles/inputBoxStyle";
import RobotIcon from "@/src/components/icon/RobotIcon";

export default function CreateSchedulePage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const projectId = parseInt(params.id);

    // Stepper State
    const [currentStep, setCurrentStep] = useState(1);

    // fetching
    const { data: project, isLoading, isError } = useProject(projectId);
    const { data: allAssetName } = useGetAllAssetNames(projectId);

    // Form States
    const [runNow, setRunNow] = useState(false);
    const [form, setForm] = useState({
        scheduleName: "",
        attackType: "",
        assetId: 0,
        startDate: getDisplayDate(new Date(), "input"),
        startTime: getDisplayTime(new Date(Date.now() + 3600 * 1000)),
        endDate: "",
    });
    const [repeatTrue, setRepeatTrue] = useState(false);
    const [cronTimes, setCronTimes] = useState([{ min: "0", hr: "0", day: "*", month: "*", week: "*" }]);
    const [days, setDays] = useState([
        { name: "Sun", active: false }, { name: "Mon", active: false }, { name: "Tue", active: false },
        { name: "Wed", active: false }, { name: "Thu", active: false }, { name: "Fri", active: false }, { name: "Sat", active: false }
    ]);
    const [dayOfMonth, setDayOfMonth] = useState(Array.from({ length: 31 }, (_, i) => ({ name: String(i + 1), active: false })));
    

    // Error states
    const [errors, setErrors] = useState({ name: false, attackType: false, asset: false });
    const [repeatedTimeError, setRepeatedTimeError] = useState<boolean>(false);

    // Validation Logic
    const validateStep = (step: number) => {
        if (step === 1) {
            const hasError = form.scheduleName === "";
            setErrors(prev => ({ ...prev, name: hasError }));
            return !hasError;
        }
        if (step === 2) {
            const attackError = form.attackType === "";
            const assetError = !form.assetId || form.assetId === 0;
            setErrors(prev => ({ ...prev, attackType: attackError, asset: assetError }));
            return !attackError && !assetError;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => setCurrentStep(prev => prev - 1);

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
            day: dates === "" || dates === "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31" ? "*" : dates,
            month,
            week: week === "" || week === "0,1,2,3,4,5,6" ? "*" : week
        }));


        const cronString = allCronExpression
            .map(({ min, hr, day, month, week }) => `${min} ${hr} ${day} ${month} ${week}`)
            .join("Z");

        return cronString;
    }


    const handleSubmit = async () => {
        // ... (Logic เดิมของคุณ changeUserInputToCronString และการยิง API)
        // หลังยิง API สำเร็จ
        // router.push(`/projects/${projectId}/schedule`);
    };

    if (isLoading) return <div className="p-8">Loading...</div>;

    const breadcrumbItems = [
        { label: "Home", href: "/main" },
        { label: project?.name || "Project", href: `/projects/${projectId}/overview` },
        { label: "Schedule", href: `/projects/${projectId}/schedule` },
        { label: "Create", href: undefined }
    ];

    const stepItems = [
        { step: 1, label: "Set Name and Attack type" },
        { step: 2, label: "Select Asset" },
        { step: 3, label: "Schedule frequency" }
    ];

    const attackType = [
        { display: "SQL Injection", label: "sqli", desc: "Manipulate database queries through input."},
        { display: "Cross-site Scripting", label: "xss", desc: " Inject malicious scripts into web pages." }
    ];


    return (
        <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl mx-auto p-4">
            <GenericBreadcrums items={breadcrumbItems} />

            <div className="mt-10 mb-12">
                <h1 className="text-center text-[42px] font-bold mb-2">Schedule a scan</h1>
                <p className="text-center text-[#9AA6A8] text-sm">Set up automated scans to run at your preferred time. Keep your system monitored and detect issues without manual checks.</p>
            </div>

            {/* --- Section 2: Stepper UI --- */}
            <div className="flex justify-center items-center mb-16 px-10">
                {stepItems.map((item, index) => (
                    <div key={item.step} className="flex items-center">
                        <div className="flex flex-col items-center relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500 border-2 
                                ${currentStep >= item.step ? "bg-[#8FFF9C] text-[#0D1014] border-[#8FFF9C] shadow-[0_0_15px_rgba(143,255,156,0.4)]" : "bg-[#1E2429] text-[#404F57] border-[#2D2F39]"}`}>
                                {item.step}
                            </div>
                            <span className={`absolute -bottom-7 whitespace-nowrap text-[13px] font-light tracking-widest transition-colors
                                ${currentStep >= item.step ? "text-[#8FFF9C]" : "text-[#404F57]"}`}>
                                {item.label}
                            </span>
                        </div>
                        {index < 2 && (
                            <div className={`w-24 md:w-40 h-[2px] mx-4 transition-all duration-500 
                                ${currentStep > item.step ? "bg-[#8FFF9C]" : "bg-[#2D2F39]"}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* --- Section 3: Step Content Area --- */}
            <div>
                {currentStep === 1 && (
                    <div className="flex flex-col gap-8">
                        <div className="bg-[#151B1D] p-10 border-2 rounded-4xl border-[#1E2A30] flex flex-col gap-6">
                            <label className="font-semibold text-[#E6F0E6] text-[20px]">
                                Select your schedule’s name
                            </label>
                            <input 
                                type="text" 
                                className={`bg-[#0F1518] px-3 py-1 border-2 rounded-lg border-[#404F57] w-full ${errors.name ? 'border-[#FE3B46]' : ''}`}
                                placeholder="e.g., Weekly Security Audit"
                                value={form.scheduleName}
                                onChange={(e) => setForm({...form, scheduleName: e.target.value})}
                            />
                            {errors.name && <p className="text-[#FE3B46] text-xs mt-2 font-bold italic">Schedule name is required</p>}

                        </div>
                        <div className="bg-[#151B1D] p-10 border-2 rounded-4xl border-[#1E2A30] flex flex-col gap-6">
                            <label className="font-semibold text-[#E6F0E6] text-[20px]"> Select Attack Type</label>
                            <div className="flex justify-around">
                                {attackType.map((item, index) => {
                                    const isSelected = form.attackType === item.label;

                                    return (
                                        <div 
                                            key={index}
                                            onClick={() => setForm({ ...form, attackType: item.label })}
                                            className={`flex gap-6 p-6 min-w-[466px]  cursor-pointer border-2 rounded-2xl transition-all duration-300 active:scale-[0.98]
                                                ${isSelected 
                                                    ? "bg-[#1E2429] border-[#8FFF9C] shadow-[0_0_20px_rgba(143,255,156,0.15)]" 
                                                    : "bg-[#0F1518] border-[#404F57] hover:border-[#667a85]"
                                                }`}
                                        >
                                            {/* Icon Box */}
                                            <div className={`p-4 rounded-xl transition-colors duration-300 
                                                ${isSelected ? "bg-[#8FFF9C] text-[#0D1014]" : "bg-[#404F57] text-[#E6F0E6]"}`}>
                                                <RobotIcon className="w-8 h-8" />
                                            </div>
                                            
                                            <div className="flex flex-col gap-1 justify-center">
                                                <p className={`text-[18px] font-black uppercase tracking-tight transition-colors 
                                                    ${isSelected ? "text-[#8FFF9C]" : "text-[#FBFBFB]"}`}>
                                                    {item.display}
                                                </p>
                                                <p className="text-[13px] font-medium text-[#9AA6A8] leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.attackType && <p className="text-[#FE3B46] text-xs font-bold italic text-center">Please select an attack type</p>}
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto space-y-8">
                         <div>
                            <label className="block text-xs font-black uppercase text-[#667a85] mb-2 tracking-widest">Target Asset</label>
                            <GenericDropdown 
                                options={allAssetName?.map(a => ({ label: a.name, value: a.id })) || []}
                                value={form.assetId}
                                onChange={(val) => setForm({...form, assetId: Number(val)})}
                            />
                         </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="animate-in fade-in duration-500 space-y-8">
                        {/* --- Header & Run Now Toggle Section --- */}
                        <div className="bg-[#1E2429] p-6 rounded-2xl border-2 border-[#2D2F39] flex justify-between items-center shadow-inner">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-black text-[#FBFBFB] uppercase tracking-tight">Execution Method</h3>
                                <p className="text-xs text-[#9AA6A8] font-medium">Choose between immediate execution or a planned schedule.</p>
                            </div>
                            <div className="flex items-center gap-4 bg-[#0D1014] px-5 py-2.5 rounded-xl border border-[#2D2F39]">
                                <span className={`text-sm font-black uppercase tracking-widest transition-colors ${runNow ? 'text-[#8FFF9C]' : 'text-[#404F57]'}`}>
                                    Run Immediately
                                </span>
                                <ScheduleToggleSwitch checked={runNow} onChange={() => setRunNow(!runNow)} />
                            </div>
                        </div>

                        {/* --- Information Message when Run Now is active --- */}
                        {runNow && (
                            <div className="bg-[#8FFF9C]/5 border border-[#8FFF9C]/20 p-4 rounded-xl animate-in zoom-in-95 duration-300">
                                <p className="text-[#8FFF9C] text-xs font-bold text-center italic flex items-center justify-center gap-2">
                                    ⚡ Task will be initialized and queued for execution immediately after creation.
                                </p>
                            </div>
                        )}

                        {/* --- Schedule Time Settings (เดิมของคุณ แต่เพิ่ม logic หรี่ไฟเมื่อ runNow=true) --- */}
                        <div className={`flex flex-col gap-4 transition-all duration-500 ${runNow ? 'opacity-20 pointer-events-none grayscale scale-[0.98]' : 'opacity-100'}`}>
                            <span className="font-black text-[10px] uppercase text-[#667a85] tracking-[0.2em]">Manual Schedule Configuration</span>
                            
                            <div className="flex flex-col gap-6">
                                {/* Start At */}
                                <div className="flex flex-row w-full gap-6 items-end">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-black uppercase text-[#404F57] mb-2">Start Date</label>
                                        <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                            className={`${INPUT_BOX_NO_ICON_STYLE} w-full`} />
                                    </div>
                                    <div className="flex flex-col items-center justify-center pb-2 text-[#404F57] font-black italic">AT</div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-black uppercase text-[#404F57] mb-2">Start Time</label>
                                        <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                            className={`${INPUT_BOX_NO_ICON_STYLE} w-full`} />
                                    </div>
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

                                {/* Repeat Settings (Logic เดิมของคุณ) */}
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
                                                    <button className={`${GREEN_BUTTON_STYLE}`}
                                                        type="button"
                                                        onClick={handleAddTime}>
                                                        Add Time <AddTime />
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
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- Section 4: Dynamic Navigation Buttons --- */}
            <div className="flex justify-between items-center mt-4">
                {currentStep === 1 ? (
                    <button onClick={() => router.back()} className="text-[#9AA6A8] hover:text-[#FBFBFB] font-bold px-6 py-2 transition-all">
                        Cancel
                    </button>
                ) : (
                    <button onClick={handleBack} className="flex items-center gap-2 text-[#FBFBFB] font-bold px-6 py-2 bg-[#1E2429] border border-[#2D2F39] rounded-xl hover:bg-[#272D31] transition-all">
                        Go Back
                    </button>
                )}

                {currentStep < 3 ? (
                    <button 
                        onClick={handleNext} 
                        className={`${GREEN_BUTTON_STYLE} px-10 py-3 rounded-xl font-black uppercase text-sm tracking-widest`}
                    >
                        Next Step
                    </button>
                ) : (
                    <button 
                        onClick={handleSubmit} 
                        className={`${GREEN_BUTTON_STYLE} px-10 py-3 rounded-xl font-black uppercase text-sm tracking-widest shadow-[0_0_20px_rgba(143,255,156,0.3)] transition-all active:scale-95`}
                    >
                        {/* ✅ เช็คเงื่อนไข runNow เพื่อเปลี่ยนข้อความ */}
                        {runNow ? "Run Now !!" : "Create Schedule"}
                    </button>
                )}
            </div>
        </div>
    );
}