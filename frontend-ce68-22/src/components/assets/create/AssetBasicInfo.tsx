import { UseFormReturn } from "react-hook-form";
import { AssetFormInputs } from "@/src/hooks/asset/use-createAssetLogic";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { INPUT_BOX_NO_ICON_STYLE } from "@/src/styles/inputBoxStyle";

interface Props {
    formMethods: UseFormReturn<AssetFormInputs>;
    currentAssetType: "IP" | "URL";
}

export const AssetBasicInfo = ({ formMethods, currentAssetType }: Props) => {
    const { register, setValue, formState: { errors } } = formMethods;

    // Tailwind Class สำหรับ Input พื้นฐาน
    const inputBaseStyle = (hasError: boolean) => `
        w-full bg-[#1A2025] text-[#E6F0E6] text-lg px-5 py-3 
        rounded-2xl border transition-all duration-200 outline-none
        placeholder:text-[#667a85]
        ${hasError 
            ? "border-[#FE3B46] focus:border-[#FE3B46] shadow-[0_0_10px_rgba(254,59,70,0.1)]" 
            : "border-[#2D2F39] focus:border-[#8FFF9C] hover:border-[#404F57] focus:shadow-[0_0_15px_rgba(143,255,156,0.1)]"
        }
    `;

    return (
        <div className="flex flex-col gap-8">
            {/* --- Asset Name Section --- */}
            <div className="flex flex-col gap-3">
                <label className="text-[#E6F0E6] font-bold text-2xl tracking-tight">
                    Asset Name
                </label>
                <input
                    type="text"
                    placeholder="e.g. Production Web Server"
                    className={inputBaseStyle(!!errors.name) + INPUT_BOX_NO_ICON_STYLE}
                    {...register("name", { required: "Asset Name is required" })}
                />
                {errors.name && (
                    <div className="flex items-center gap-1 px-1 animate-in fade-in slide-in-from-top-1">
                        <ErrorOutlineIcon sx={{ color: "#FE3B46", fontSize: 16 }} />
                        <span className="text-[#FE3B46] text-xs font-medium italic">
                            {errors.name.message}
                        </span>
                    </div>
                )}
            </div>

            {/* --- Asset Target & Type Section --- */}
            <div className="flex flex-col gap-4">
                <label className="text-[#E6F0E6] font-bold text-2xl tracking-tight">
                    Asset Target
                </label>
                
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder={currentAssetType === "IP" ? "e.g. 192.168.0.1" : "e.g. https://example.com"}
                        className={inputBaseStyle(!!errors.target) + INPUT_BOX_NO_ICON_STYLE}
                        {...register("target", { required: "Asset Target is required" })}
                    />
                    {errors.target && (
                        <div className="flex items-center gap-1 px-1">
                            <ErrorOutlineIcon sx={{ color: "#FE3B46", fontSize: 16 }} />
                            <span className="text-[#FE3B46] text-xs font-medium italic">
                                {errors.target.message}
                            </span>
                        </div>
                    )}
                </div>

                {/* --- Asset Type Selector (Buttons) --- */}
                <div className="flex items-center gap-4 mt-1">
                    <span className="text-[#9AA6A8] font-medium text-base">
                        Asset type:
                    </span>
                    <div className="flex gap-3">
                        {["IP", "URL"].map((type) => {
                            const isActive = currentAssetType === type;
                            return (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setValue("type", type as "IP" | "URL")}
                                    className={`
                                        px-6 py-2 rounded-xl font-bold text-base transition-all active:scale-95
                                        ${isActive 
                                            ? "bg-[#8FFF9C] text-[#0B0F12] shadow-[0_0_15px_rgba(143,255,156,0.3)]" 
                                            : "bg-[#FBFBFB] text-[#0B0F12] hover:bg-[#E0E0E0]"
                                        }
                                    `}
                                >
                                    {type}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};