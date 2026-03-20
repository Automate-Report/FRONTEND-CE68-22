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
import { GenericPagination } from "@/src/components/Common/GenericPagination";
import ToggleSwitch from "@/src/components/Common/ToggleSwitch";

import ScheduleToggleSwitch from "@/src/components/schedule/ToggleSwitch";
import CreateAssetModal from "@/src/components/assets/CreateAsset";

//icons
import AddTime from "@/src/components/icon/AddTime";
import DeleteProjectIcon from "@/src/components/icon/Delete";
import RobotIcon from "@/src/components/icon/RobotIcon";
import AssetIcon from "@/src/components/icon/AssetIcon";

import { INPUT_BOX_NO_ICON_STYLE } from "@/src/styles/inputBoxStyle";
import { GREEN_BUTTON_STYLE, RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";

export default function CreateSchedulePage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const projectId = parseInt(params.id);

    // Stepper State
    const [currentStep, setCurrentStep] = useState(1);

    // fetching
    const { data: project, isLoading, isError } = useProject(projectId);
    const { data: allAssetName, refetch: refetchAssets } = useGetAllAssetNames(projectId);

    // Form States
    const [runNow, setRunNow] = useState(false);
    const [form, setForm] = useState({
        scheduleName: "",
        attackType: [] as string[],
        assetId: 0,
        startDate: getDisplayDate(new Date(), "input"),
        startTime: getDisplayTime(new Date(Date.now() + 3600 * 1000)),
        endDate: "",
    });
    const [repeatTrue, setRepeatTrue] = useState(false);
    const [cronTimes, setCronTimes] = useState([{ min: "0", hr: "0", day: "*", month: "*", week: "*" }]);
    const [days, setDays] = useState([
        { name: "Sun", active: false },
        { name: "Mon", active: false },
        { name: "Tue", active: false },
        { name: "Wed", active: false },
        { name: "Thu", active: false },
        { name: "Fri", active: false },
        { name: "Sat", active: false }
    ]);
    const [dayOfMonth, setDayOfMonth] = useState(Array.from({ length: 31 }, (_, i) => ({ name: String(i + 1), active: false })));

    // Create Asset Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Pagination Asset
    const [assetPage, setAssetPage] = useState(0);
    const [assetRowsPerPage, setAssetRowsPerPage] = useState(4);
    const startIndex = assetPage * assetRowsPerPage;
    const paginatedAssets = allAssetName?.slice(startIndex, startIndex + assetRowsPerPage) || [];

    // Error states
    const [errors, setErrors] = useState({ name: false, attackType: false, asset: false });
    const [repeatedTimeError, setRepeatedTimeError] = useState<boolean>(false);

    // Validation Logic
    const validateStep = (step: number) => {
        if (step === 1) {
            const hasError = form.scheduleName === "";
            const attackError = form.attackType.length === 0;
            setErrors(prev => ({ ...prev, attackType: attackError , name: hasError }));
            return !attackError && !hasError;
        }
        if (step === 2) {
            const assetError = !form.assetId || form.assetId === 0;
            setErrors(prev => ({ ...prev, asset: assetError }));
            return !assetError;
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cronString = changeUserInputToCronString();
        if (!cronString) return;

        const finalAtkType = form.attackType.length === 2 ? "all" : form.attackType[0];

        if (runNow) {
            const payload: ScheduleCreatePayload = {
                project_id: projectId,
                name: form.scheduleName,
                atk_type: finalAtkType,
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
            atk_type: finalAtkType,
            asset: form.assetId,
            cron_expression: cronString,
            start_date: new Date(`${form.startDate}T${form.startTime}:00`),
            end_date: (!repeatTrue || form.endDate) ? new Date(form.startDate) : new Date(form.endDate),
        };
        const data = await scheduleService.create(payload);
        router.push(`/projects/${projectId}/schedule`);
    }

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
        { display: "SQL Injection", value: "sqli", desc: "Manipulate database queries through input." },
        { display: "Cross-site Scripting", value: "xss", desc: " Inject malicious scripts into web pages." }
    ];

    return (
        <div className="flex flex-col w-full text-[#E6F0E6] max-w-7xl mx-auto">
            <GenericBreadcrums items={breadcrumbItems} />

            <div className="mt-6 mb-12 flex flex-col justify-center items-center">
                <h1 className="text-center text-4xl font-bold mb-6">Schedule a scan</h1>
                <p className="text-center text-[#9AA6A8] text-sm w-[50%]">Set up automated scans to run at your preferred time. Keep your system monitored and detect issues without manual checks.</p>
            </div>

            {/* --- Section 2: Stepper UI --- */}
            <div className="flex justify-center items-center mb-6">
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
            <div className="mt-12">
                {currentStep === 1 && (
                    <div className="flex flex-col gap-6">
                        <div className="bg-[#151B1D] px-10 py-8 border-2 rounded-4xl border-[#1E2A30] flex flex-col gap-6">
                            <label className="font-semibold text-[#E6F0E6] text-xl ">
                                Select your schedule’s name
                            </label>
                            <input
                                type="text"
                                className={INPUT_BOX_NO_ICON_STYLE}
                                placeholder="e.g., Weekly Security Audit"
                                value={form.scheduleName}
                                onChange={(e) => setForm({ ...form, scheduleName: e.target.value })}
                            />
                            {errors.name && <p className="text-[#FE3B46] text-sm font-md italic">Schedule name is required</p>}

                        </div>
                        <div className="bg-[#151B1D] px-10 py-8 border-2 rounded-4xl border-[#1E2A30] flex flex-col gap-6">
                            <label className="font-semibold text-[#E6F0E6] text-xl"> Select Attack Type</label>
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
                )}

                {currentStep === 2 && (
                    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
                        <div className="bg-[#151B1D] px-10 py-8 border-2 rounded-4xl border-[#1E2A30] flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold text-[#E6F0E6] text-xl">Select Target Asset</label>
                                    <p className="text-sm text-[#9AA6A8]">Choose the specific asset you want to perform the security scan on.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center justify-center text-center font-semibold h-[42px] gap-2 px-6 py-2 text-[#E6F0E6] bg-[#0F1518] border-[2px] border-[rgba(64,79,87,0.4)] rounded-xl hover:bg-[rgba(64,79,87,0.4)] hover:text-white cursor-pointer transition"
                                >
                                    Create New Asset
                                    <AssetIcon />
                                </button>
                            </div>


                            {/* Grid แสดง Asset (ใช้ paginatedAssets แทน) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                {paginatedAssets.map((asset) => {
                                    const isSelected = form.assetId === asset.id;
                                    return (
                                        <div
                                            key={asset.id}
                                            onClick={() => setForm({ ...form, assetId: asset.id })}
                                            className={`flex gap-3 p-4 cursor-pointer border-2 rounded-2xl transition-all duration-300 active:scale-[0.98]
                                                ${isSelected
                                                    ? "bg-[#1E2429] border-[#8FFF9C] shadow-[0_0_20px_rgba(143,255,156,0.15)]"
                                                    : "bg-[#0F1518] border-[#404F57] hover:border-[#667a85]"
                                                }`}
                                        >
                                            <div className={`w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 border-2
                                                ${isSelected
                                                    ? "bg-[#8FFF9C] text-[#0D1014] border-[#8FFF9C]"
                                                    : "bg-[#404F57] text-[#E6F0E6] border-transparent"
                                                }`}>
                                                {isSelected ? (
                                                    <div className="animate-in zoom-in duration-300">
                                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <AssetIcon />
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1 justify-center">
                                                <p className={`text-[18px] font-bold transition-colors ${isSelected ? "text-[#8FFF9C]" : "text-[#FBFBFB]"}`}>
                                                    {asset.name}
                                                </p>
                                                <p className="text-[13px] font-normal text-[#8FFF9C] opacity-70">
                                                    {asset.target}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ✅ ใส่ GenericPagination ตรงนี้ */}
                            <div className="mt-2 bg-[#0D1014]/50 rounded-xl border border-[#2D2F39]">
                                <GenericPagination
                                    count={allAssetName?.length || 0}
                                    page={assetPage}
                                    rowsPerPage={assetRowsPerPage}
                                    onPageChange={(newPage) => setAssetPage(newPage)}
                                    rowsPerPageOptions={[4, 8, 16]}
                                    onRowsPerPageChange={(newRows) => {
                                        setAssetRowsPerPage(newRows);
                                        setAssetPage(0); // reset ไปหน้าแรกเมื่อเปลี่ยนจำนวนแสดงผล
                                    }}
                                    labelRowsPerPage="Assets per page:"
                                />
                            </div>

                            {errors.asset && <p className="text-[#FE3B46] text-sm font-md italic text-center">Please select an asset</p>}

                            <CreateAssetModal
                                projectName={project?.name || "Project"}
                                open={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                projectId={projectId}
                                onSuccess={() => {
                                    refetchAssets();
                                    router.refresh();
                                    alert("Asset created successfully!");
                                }}
                            />
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="animate-in fade-in duration-500 space-y-8">
                        <div className="bg-[#151B1D] px-10 py-8 border-2 rounded-4xl border-[#1E2A30] flex flex-col gap-6">

                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-[#E6F0E6] text-xl">Select Schedule’s Frequency</h3>
                                <div className="flex items-center gap-4 bg-[#0D1014] px-5 py-2.5 rounded-xl border border-[#2D2F39]  animate-[shadowPulse_2s_ease-in-out_infinite]">
                                    <span className={`text-base uppercase font-bold transition-colors 
                                        ${runNow ? 'text-[#8FFF9C]' : 'text-[#E6F0E6]'}`}>
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
                            <div className={`flex flex-col gap-2 transition-all duration-500 ${runNow ? 'opacity-20 pointer-events-none grayscale scale-[0.98]' : 'opacity-100'}`}>
                                <div className="flex flex-col gap-6">
                                    {/* Start At */}
                                    <div className="flex flex-row w-full gap-6 items-end">
                                        <div className="flex-1">
                                            <label className="block text-[16px] mb-2">Start Date</label>
                                            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                                className={`${INPUT_BOX_NO_ICON_STYLE} w-full`} />
                                        </div>
                                        <div className="flex flex-col items-center justify-center pb-2 text-[#404F57] font-black italic">AT</div>
                                        <div className="flex-1">
                                            <label className="block text-[16px] mb-2">Start Time</label>
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

                    </div>
                )}
            </div>

            {/* --- Section 4: Dynamic Navigation Buttons --- */}
            <div className="flex gap-6 items-center mt-[30px] justify-between">
                {currentStep === 1 ? (
                    <button
                        onClick={() => router.back()}
                        className={`${RED_BUTTON_STYLE} w-full justify-center`}
                    >
                        Cancel
                    </button>
                ) : (
                    <button onClick={handleBack} className="w-full flex justify-center items-center gap-2 text-[#FBFBFB] font-bold px-6 py-2 bg-[#1E2429] border border-[#2D2F39] rounded-xl hover:bg-[#272D31] transition-all">
                        Go Back
                    </button>
                )}

                {currentStep < 3 ? (
                    <button
                        onClick={handleNext}
                        className={`${GREEN_BUTTON_STYLE} w-full`}
                    >
                        Next Step
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className={`${GREEN_BUTTON_STYLE} w-full`}
                    >
                        {/* ✅ เช็คเงื่อนไข runNow เพื่อเปลี่ยนข้อความ */}
                        {runNow ? "Run Now !!" : "Create Schedule"}
                    </button>
                )}
            </div>
        </div>
    );
}