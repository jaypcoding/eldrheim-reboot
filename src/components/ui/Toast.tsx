import { useEffect, useState, type ReactNode } from "react";

interface ToastItem {
  id: number;
  message: string;
  kind: "success" | "error" | "info";
}

let toastId = 0;
const listeners = new Set<(items: ToastItem[]) => void>();
let currentToasts: ToastItem[] = [];

export function showToast(message: string, kind: ToastItem["kind"] = "info"): void {
  const item: ToastItem = { id: ++toastId, message, kind };
  currentToasts = [...currentToasts, item];
  listeners.forEach((fn) => fn(currentToasts));
  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== item.id);
    listeners.forEach((fn) => fn(currentToasts));
  }, 3500);
}

export function ToastContainer(): ReactNode {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
