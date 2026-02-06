import { useState } from "react";

type ToggleSwitchProps = {
    initial?: boolean;
    onChange?: (value: boolean) => void;
};

export default function ToggleSwitch({
    initial = false,
    onChange,
}: ToggleSwitchProps) {
    const [checked, setChecked] = useState(initial);

    const toggle = () => {
        setChecked(!checked);
        onChange?.(!checked);
    };

    return (
        <button
            type="button"
            onClick={toggle}
            className={`relative w-16 h-8 rounded-full transition-colors ${checked ? "bg-green-400" : "bg-gray-300"
                }`}
            aria-pressed={checked}
        >
            <span
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${checked ? "translate-x-8" : "translate-x-0"
                    }`}
            />
        </button>
    );
}