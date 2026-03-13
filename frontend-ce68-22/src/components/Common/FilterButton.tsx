"use client";

import { useState, useRef, useEffect } from "react";
import FilterIcon from "@/src/components/icon/Filter";
import { FILTER_BUTTON_STYLE } from "@/src/styles/buttonStyle";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterProps {
  options: FilterOption[];
  currentValue: string;
  onSelect: (value: string) => void;
}

export function GenericFilterButton({ options, currentValue, onSelect }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ปิด Dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === currentValue)?.label || "Filter";

  return (
    <div className="relative" ref={dropdownRef}>
      {/*ปุ่มกด (Trigger) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${FILTER_BUTTON_STYLE} flex items-center justify-between gap-4 min-w-[100px] whitespace-nowrap transition-all duration-200
          hover:brightness-110 active:scale-[0.98]`}
      >
        <span className="flex items-center opacity-70 gap-2">
          {selectedLabel}
          <FilterIcon />
        </span>
      </button>

      {/*รายการตัวเลือก (Dropdown Menu) */}
      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-[#0F1518] border-2 border-[#404F57] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onSelect(opt.value);
                  setIsOpen(false);
                }}
                className={`flex items-center h-[42px] px-4 cursor-pointer transition-colors text-sm
                  ${currentValue === opt.value 
                    ? "bg-[#2D353B] text-[#8FFF9C] font-bold" 
                    : "text-[#E6F0E6] hover:bg-[#1D2226]"
                  }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}