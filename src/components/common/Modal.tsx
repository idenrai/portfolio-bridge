import { type ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** 최대 너비 (Tailwind class) */
  maxWidth?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={`${maxWidth} w-[calc(100%-1rem)] sm:w-full rounded-xl border-none shadow-2xl backdrop:bg-black/60 p-0 max-h-[85vh] sm:max-h-[90vh] flex flex-col`}
    >
      {open && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col min-h-0 max-h-[85vh] sm:max-h-[90vh]">
          {title && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800/50 shrink-0">
              <h2 className="text-base font-semibold text-slate-200">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-300 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
          <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto">
            {children}
          </div>
        </div>
      )}
    </dialog>
  );
}
