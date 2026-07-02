import { type ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
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
      className={`${maxWidth} w-[calc(100%-1rem)] sm:w-full rounded-none border-none shadow-none backdrop:bg-black/80 p-0 m-auto max-h-[85vh] sm:max-h-[90vh] flex flex-col`}
    >
      {open && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-none flex flex-col min-h-0 max-h-[85vh] sm:max-h-[90vh]">
          {title && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-800 shrink-0">
              <h2 className="text-base font-bold text-white">
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-zinc-500 hover:text-zinc-300 text-sm leading-none cursor-pointer font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 rounded"
              >
                [ X ]
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
