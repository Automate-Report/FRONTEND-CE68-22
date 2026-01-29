import { useState } from "react";

type Option<T> = {
    label: string;
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
                className="w-full bg-[#FBFBFB] border rounded-lg px-3 py-2
                    flex justify-between items-center text-[#404F57] mr-3"
            >
                <span>{selected?.label ?? placeholder}</span>
                <span className="text-xs">▾</span>
            </button>

            {/* Dropdown menu */}
            {open && (
                <div className="absolute z-10 mt-1 w-full bg-white border
                        rounded-lg shadow max-h-48 overflow-auto">
                    {options.map(opt => (
                        <div
                            key={String(opt.value)}
                            onClick={() => {
                                onChange?.(opt.value);
                                setOpen(false);
                            }}
                            className={`px-3 py-2 cursor-pointer text-[#404F57] hover:bg-[#E6F0E6]
                ${value === opt.value
                                    ? "bg-[#E6F0E6] font-semibold"
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
