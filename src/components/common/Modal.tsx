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
      className={`${maxWidth} m-auto flex max-h-[85vh] w-[calc(100%-1rem)] flex-col rounded-none border-none p-0 shadow-none backdrop:bg-black/80 sm:max-h-[90vh] sm:w-full`}
    >
      {open && (
        <div className="flex max-h-[85vh] min-h-0 flex-col rounded-none border border-zinc-800 bg-zinc-950 sm:max-h-[90vh]">
          {title && (
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-4 py-3 sm:px-6 sm:py-4">
              <h2 className="text-base font-bold text-white">
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="cursor-pointer rounded text-sm leading-none font-bold text-zinc-500 hover:text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
              >
                [ X ]
              </button>
            </div>
          )}
          <div className="overflow-y-auto p-4 sm:px-6 sm:py-5">
            {children}
          </div>
        </div>
      )}
    </dialog>
  );
}
