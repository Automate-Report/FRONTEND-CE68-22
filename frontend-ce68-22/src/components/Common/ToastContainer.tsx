"use client";

import { useState, useEffect, useCallback, use } from "react";
import ReactDOM from "react-dom";
import GenericToast from "./GenericToast";

interface ToastItem {
    id: number;
    icon: React.ReactNode;
    message: string;
    borderColor?: string;
    textColor?: string;
    duration?: number;
}

type ToastOptions = Omit<ToastItem, "id">;

// Singleton emitter
type Listener = (toast: ToastOptions) => void;
let listener: Listener | null = null;

export function showToast(options: ToastOptions) {
    listener?.(options);
}

export default function ToastContainer() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const [mounted, setMounted] = useState(false);
    const [leavingIds, setLeavingIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        setMounted(true);
    }, []);

    const removeToast = useCallback((id: number) => {
        setLeavingIds((prev) => new Set(prev).add(id)); // mark as leaving
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id)); // remove after animation
            setLeavingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
        }, 300); // match animation duration
    }, []);

    useEffect(() => {
        listener = (options) => {
            const id = Date.now();
            setToasts((prev) => {
                if (prev.length >= 4) {
                    const oldest = prev[0];
                    setLeavingIds((s) => new Set(s).add(oldest.id));
                    setTimeout(() => {
                        setToasts((prev) => prev.filter((t) => t.id !== oldest.id));
                        setLeavingIds((s) => { const n = new Set(s); n.delete(oldest.id); return n; });
                    }, 300);
                    return [...prev, { ...options, id }]; // 👈 keep oldest, just mark it leaving
                }
                return [...prev, { ...options, id }];
            });

            if (options.duration !== 0) {
                setTimeout(() => removeToast(id), options.duration ?? 3000);
            }
        };
        return () => { listener = null; };
    }, [removeToast]);

    if (!mounted) return null;

    return ReactDOM.createPortal(
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
            {toasts.map((t) => (
                <div key={t.id} className={leavingIds.has(t.id) ? "animate-toast-out" : "animate-toast-in"}>
                    <GenericToast
                        key={t.id}
                        icon={t.icon}
                        message={t.message}
                        onClose={() => removeToast(t.id)}
                        borderColor={t.borderColor}
                        textColor={t.textColor}
                    />
                </div>
            ))}
        </div>,
        document.body
    );
}