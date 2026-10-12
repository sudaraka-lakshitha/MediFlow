import { useEffect, useId, useRef, type ReactNode } from "react";

const openDialogs: HTMLElement[] = [];
let unlockedBodyOverflow = "";

export function Modal({
  title,
  children,
  onClose,
  size = "md",
  closable = true,
}: {
  title: string;
  children: ReactNode;
  onClose(): void;
  size?: "sm" | "md" | "lg" | "xl";
  closable?: boolean;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeState = useRef({ onClose, closable });
  useEffect(() => { closeState.current = { onClose, closable }; }, [onClose, closable]);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!openDialogs.length) unlockedBodyOverflow = document.body.style.overflow;
    openDialogs.push(dialog);
    const isTopDialog = () => openDialogs.at(-1) === dialog;
    const focusable = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') || []).filter((element) => element.offsetParent !== null);
    const focusFrame = window.requestAnimationFrame(() => {
      if (isTopDialog()) (focusable()[0] || dialog).focus();
    });
    const close = (event: KeyboardEvent) => {
      if (!isTopDialog()) return;
      if (event.key === "Escape" && closeState.current.closable) {
        event.preventDefault();
        closeState.current.onClose();
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) { event.preventDefault(); dialogRef.current?.focus(); return; }
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", close);
      const wasTop = isTopDialog();
      openDialogs.splice(openDialogs.indexOf(dialog), 1);
      if (!openDialogs.length) document.body.style.overflow = unlockedBodyOverflow;
      if (wasTop && previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop-custom"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(event) =>
        event.target === event.currentTarget && closable && onClose()
      }
    >
      <div ref={dialogRef} className={`modal-card modal-${size}`} tabIndex={-1}>
        <div className="panel-header">
          <h3 id={titleId}>{title}</h3>
          {closable && (
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export function ModalActions({
  onClose,
  submitLabel = "Save changes",
  busy = false,
  disabled = false,
  busyLabel = "Saving...",
  showCancel = true,
}: {
  onClose(): void;
  submitLabel?: string;
  busy?: boolean;
  disabled?: boolean;
  busyLabel?: string;
  showCancel?: boolean;
}) {
  return (
    <div className="modal-actions">
      {showCancel && (
        <button type="button" className="btn btn-light" onClick={onClose}>
          Cancel
        </button>
      )}
      <button type="submit" className="btn btn-primary" disabled={busy || disabled}>
        {busy ? busyLabel : submitLabel}
      </button>
    </div>
  );
}
