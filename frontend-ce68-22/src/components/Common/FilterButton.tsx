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
    // ✅ ใช้ w-fit เพื่อให้ Container กว้างเท่ากับปุ่ม
    <div className="relative w-fit" ref={dropdownRef}>
      {/* ปุ่มกด (Trigger) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${FILTER_BUTTON_STYLE} 
          flex items-center justify-between 
          gap-4 px-4 py-2.5
          w-fit whitespace-nowrap transition-all duration-200
          hover:brightness-110 active:scale-[0.98]`}
      >
        <span className="flex items-center gap-2 text-base">
          <p className="hidden lg:block">{selectedLabel}</p>
          <div className="w-4 h-4 opacity-70">
            <FilterIcon />
          </div>
          
        </span>
      </button>

      {/* รายการตัวเลือก (Dropdown Menu) */}
      {isOpen && (
        <div 
          className="absolute z-50 mt-2 
            /* ✅ w-max: กว้างตามข้อความที่ยาวที่สุด */
            /* ✅ min-w-full: แต่ต้องไม่แคบกว่าปุ่มกด */
            w-max min-w-full 
            bg-[#0F1518] border-2 border-[#404F57] 
            rounded-xl shadow-2xl overflow-hidden 
            animate-in fade-in zoom-in duration-150 origin-top-left"
        >
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onSelect(opt.value);
                  setIsOpen(false);
                }}
                className={`flex items-center h-[42px] px-5 cursor-pointer transition-colors text-base whitespace-nowrap
                  ${currentValue === opt.value 
                    ? "bg-[#2D353B] text-[#8FFF9C]" 
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