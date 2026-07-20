import { useEffect, type ReactNode } from "react";

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
  useEffect(() => {
    const close = (event: KeyboardEvent) =>
      event.key === "Escape" && closable && onClose();
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [closable, onClose]);
  return (
    <div
      className="modal-backdrop-custom"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) =>
        event.target === event.currentTarget && closable && onClose()
      }
    >
      <div className={`modal-card modal-${size}`}>
        <div className="panel-header">
          <h3>{title}</h3>
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
  busyLabel = "Saving...",
  showCancel = true,
}: {
  onClose(): void;
  submitLabel?: string;
  busy?: boolean;
  busyLabel?: string;
  showCancel?: boolean;
}) {
  return (
    <div className="d-flex justify-content-end gap-2 mt-4">
      {showCancel && (
        <button type="button" className="btn btn-light" onClick={onClose}>
          Cancel
        </button>
      )}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? busyLabel : submitLabel}
      </button>
    </div>
  );
}
