import { ReactNode, useState } from "react";
import { INPUT_BOX_NO_ICON_STYLE } from "@/src/styles/inputBoxStyle";

type Option<T> = {
    label: ReactNode;
    value: T;
};

type DropdownProps<T> = {
    options: Option<T>[];
    value?: T;
    onChange?: (value: T) => void;
    placeholder?: string;
    width?: string;
};

export default function GenericDropdown<T>({
    options,
    value,
    onChange,
    placeholder = "Select",
    width,
}: DropdownProps<T>) {
    const [open, setOpen] = useState(false);

    const selected = options.find(o => o.value === value);

    return (
        <div className={"relative w-" + width}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`${INPUT_BOX_NO_ICON_STYLE} w-full flex justify-between items-center`}
            >
                <span>{selected?.label ?? placeholder}</span>
                <span className="text-sm mr-3">▾</span>
            </button>

            {/* Dropdown menu */}
            {open && (
                <div className="absolute z-10 mt-1 w-full bg-[#0F1518] border-[2px] border-[#404F57]
                        rounded-xl shadow max-h-48 overflow-auto">
                    {options.map(opt => (
                        <div
                            key={String(opt.value)}
                            onClick={() => {
                                onChange?.(opt.value);
                                setOpen(false);
                            }}
                            className={`relative flex items-center h-[42px] rounded-xl pl-3 shadow-sm transition text-[#E6F0E6] placeholder-[#9AA6A8] focus:outline-none
                                hover:bg-[#1D2226] cursor-pointer
                                ${value === opt.value
                                    ? "bg-[#2D353B] font-semibold hover:bg-[#2D353B]"
                                    : ""
                                }`}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
