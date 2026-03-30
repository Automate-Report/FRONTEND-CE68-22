"use client";

import { useState, useEffect } from "react";
import { WarningAmber as WarningAmberIcon, Close as CloseIcon } from "@mui/icons-material";
import { FILTER_BUTTON_STYLE, RED_BUTTON_STYLE } from "@/src/styles/buttonStyle";

// ── Types ─────────────────────────────────────────────────────────────────────
interface GenericDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityName: string;
  entityType?: string;
  loading?: boolean;
  description?: React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function GenericDeleteModal({
  open,
  onClose,
  onConfirm,
  entityName,
  entityType = "Item",
  loading = false,
  description,
}: GenericDeleteModalProps) {
  const [inputValue, setInputValue] = useState("");
  const isMatch = inputValue === entityName;

  useEffect(() => {
    if (open) setInputValue("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border-[2px] border-[#2D2F39] border-t-0 bg-[#1E2429] shadow-2xl overflow-hidden relative">

        {/* Top danger strip */}
        <div className="h-0.5 w-full bg-[#FE3B46]" />

        {/* X */}
        {!loading && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#9AA6A8] transition-colors hover:text-[#FBFBFB] absolute top-2 right-2"
          >
            <CloseIcon fontSize="small" />
          </button>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3 text-[#FE3B46]">
              <WarningAmberIcon sx={{ fontSize: 28 }} />
              <h2 className="font-bold text-xl leading-tight text-[#FE3B46]">
                Delete {entityType}
              </h2>
            </div>
          </div>

          {/* Warning description */}
          <p className="text-sm text-[#9AA6A8] leading-relaxed mb-5">
            {description ? description : (
              <>
                This action <strong className="text-[#FBFBFB] font-semibold">cannot</strong> be undone. This will
                permanently delete the {entityType.toLowerCase()}{" "}
                <strong className="text-[#FE3B46]">{entityName}</strong> and remove all associated data.
              </>
            )}
          </p>

          {/* Confirm label */}
          <p className="text-xs text-[#9AA6A8] mb-2">
            Please type{" "}
            <strong className="select-all text-[#FBFBFB]">{entityName}</strong>{" "}
            to confirm.
          </p>

          {/* Input */}
          <input
            className="w-full rounded-lg border border-[#2D2F39] bg-[#0D1014] px-3 py-2.5 text-sm text-[#FBFBFB] placeholder:text-[#404F57] focus:border-[#FE3B46] focus:outline-none transition-colors disabled:opacity-50"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={entityName}
            disabled={loading}
            autoComplete="off"
          />

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className={`${FILTER_BUTTON_STYLE} disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!isMatch || loading}
              className={`${RED_BUTTON_STYLE} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {loading ? "Deleting..." : `Delete this ${entityType.toLowerCase()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}