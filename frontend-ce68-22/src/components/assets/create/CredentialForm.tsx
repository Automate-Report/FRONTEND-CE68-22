import { UseFormReturn } from "react-hook-form";
import { AssetFormInputs } from "@/src/hooks/asset/use-createAssetLogic";

// MUI Icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CreateAssetIcon from "@/src/components/icon/CreateAssertIcon"; 

interface Props {
    formMethods: UseFormReturn<AssetFormInputs>;
    showCredential: boolean;
    setShowCredential: (val: boolean) => void;
    showPassword: boolean;
    setShowPassword: (val: boolean) => void;
}

export const CredentialForm = ({ formMethods, showCredential, setShowCredential, showPassword, setShowPassword }: Props) => {
    const { register, formState: { errors }, setValue, clearErrors } = formMethods;

    const handleRemoveCredential = () => {
        setShowCredential(false);
        setValue("username", "");
        setValue("password", "");
        clearErrors(["username", "password"]);
    };

    // Tailwind Class สำหรับ Input
    const inputStyle = (hasError: boolean) => `
        w-full bg-[#1A2025] text-[#E6F0E6] text-sm px-4 py-2.5 
        rounded-xl border transition-all duration-200 outline-none
        ${hasError 
            ? "border-[#FE3B46] focus:border-[#FE3B46]" 
            : "border-[#2D2F39] focus:border-[#8FFF9C] hover:border-[#404F57]"
        }
        placeholder:text-[#667a85]
    `;

    return (
        <div className="mt-8 mb-4 font-sans">
            {/* Header: Title & Remove Button */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#E6F0E6] font-bold text-xl tracking-tight">
                    Asset Credentials
                </h3>
                {showCredential && (
                    <button 
                        type="button"
                        onClick={handleRemoveCredential}
                        className="flex items-center gap-1 text-[#FE3B46] font-bold text-sm hover:brightness-125 transition-all"
                    >
                        <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                        <span>Remove</span>
                    </button>
                )}
            </div>

            {!showCredential ? (
                /* Add Credentials Button */
                <button
                    type="button"
                    onClick={() => setShowCredential(true)}
                    className="flex items-center gap-2 px-6 py-2.5 border-1 border-[#E6F0E6] text-[#E6F0E6] 
                               rounded-lg font-bold text-sm transition-all hover:border-[#8FFF9C] 
                               hover:text-[#8FFF9C] hover:bg-[#8FFF9C]/5 active:scale-95"
                >
                    <CreateAssetIcon color="currentColor" />
                    <span>Add New Credentials</span>
                </button>
            ) : (
                /* Credentials Table Container */
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="w-full overflow-hidden border border-[#2D2F39] rounded-2xl bg-[#0B0F12]">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#1A2025]">
                                    <th className="px-6 py-3 text-[#9AA6A8] text-[11px] font-black uppercase tracking-widest border-b border-[#2D2F39]">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-[#9AA6A8] text-[11px] font-black uppercase tracking-widest border-b border-[#2D2F39]">
                                        Password
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="group">
                                    <td className="p-4 align-top">
                                        <input
                                            type="text"
                                            placeholder="e.g. root"
                                            className={inputStyle(!!errors.username)}
                                            {...register("username", { required: showCredential })}
                                        />
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="relative">
                                          <input
                                              type={showPassword ? "text" : "password"}
                                              placeholder="••••••••"
                                              className={inputStyle(!!errors.password)}
                                              {...register("password", { required: showCredential })}
                                          />
                                          <button
                                              type="button"
                                              onClick={() => setShowPassword(!showPassword)}
                                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667a85] hover:text-[#E6F0E6] transition-colors p-1"
                                          >
                                              {showPassword ? <Visibility sx={{ fontSize: 20 }} /> : <VisibilityOff sx={{ fontSize: 20 }} />}
                                          </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Error Handling UI */}
                    {(errors.username || errors.password) && (
                        <div className="flex items-center gap-2 px-2 py-1">
                            <ErrorOutlineIcon sx={{ color: "#FE3B46", fontSize: 18 }} />
                            <span className="text-[#FE3B46] text-xs font-semibold italic">
                                Please provide both credentials to proceed.
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Bottom Hint */}
            <p className="mt-4 text-[#667a85] text-[11px] font-medium opacity-60">
                * Note: Your credentials are encrypted before being stored.
            </p>
        </div>
    );
};