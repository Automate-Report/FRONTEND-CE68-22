"use client";

import MagIcon from "@/src/components/icon/MagnifyingGlass";
import { INPUT_BOX_WITH_ICON_STYLE_DIV, INPUT_BOX_WITH_ICON_STYLE_INPUT } from "@/src/styles/inputBoxStyle";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBox({ value, onChange, placeholder = "Search...", className = "" }: SearchBoxProps) {
  return (
    <div className={`${INPUT_BOX_WITH_ICON_STYLE_DIV} ${className}`}>
      <MagIcon />
      <input
        type="text"
        placeholder={placeholder}
        className={INPUT_BOX_WITH_ICON_STYLE_INPUT}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}