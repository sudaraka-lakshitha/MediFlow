// The "Actions" button with a drop-down list of actions for a table row.

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type ActionItem = {
  label: string;
  icon: string;
  onClick(): void;
  danger?: boolean;
  disabled?: boolean;
};

const MENU_WIDTH = 232;
const VIEWPORT_GAP = 8;

// The row menus live inside `.table-responsive`, which sets `overflow-x: auto`. CSS then
// computes `overflow-y` to `auto` as well, so that container clips anything absolutely
// positioned inside it - which silently cut the menu off partway down whenever a table had
// only a row or two below the trigger. Rendering the menu into a portal with fixed
// positioning takes it out of every clipping context, so the full list is always reachable.
export function ActionsDropdown({ actions }: { actions: ActionItem[] }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; dropUp: boolean } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const place = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight ?? actions.length * 40 + 16;
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropUp = spaceBelow < menuHeight + VIEWPORT_GAP && rect.top > menuHeight + VIEWPORT_GAP;
    const left = Math.min(
      Math.max(VIEWPORT_GAP, rect.right - MENU_WIDTH),
      window.innerWidth - MENU_WIDTH - VIEWPORT_GAP,
    );
    setPosition({
      top: dropUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left,
      dropUp,
    });
  }, [actions.length]);

  useLayoutEffect(() => {
    if (open) {
      place();
      window.requestAnimationFrame(() => menuRef.current?.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus());
    }
  }, [open, place]);

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') || []);
      const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
      if (event.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
      else if (event.key === 'ArrowDown') { event.preventDefault(); buttons[(current + 1 + buttons.length) % buttons.length]?.focus(); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); buttons[(current - 1 + buttons.length) % buttons.length]?.focus(); }
      else if (event.key === 'Home') { event.preventDefault(); buttons[0]?.focus(); }
      else if (event.key === 'End') { event.preventDefault(); buttons.at(-1)?.focus(); }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    // Any scroll (page or the table's own scroller) would leave the fixed menu stranded.
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        className="btn btn-sm btn-light border"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Record actions"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); }
        }}
      >
        <i className="bi bi-three-dots-vertical" />
      </button>
      {open &&
        createPortal(
          <ul
            ref={menuRef}
            className="dropdown-menu shadow-sm show"
            role="menu"
            style={{
              position: "fixed",
              top: position?.top ?? -9999,
              left: position?.left ?? -9999,
              width: MENU_WIDTH,
              maxHeight: `calc(100vh - ${VIEWPORT_GAP * 2}px)`,
              overflowY: "auto",
              margin: 0,
              zIndex: 2000,
              visibility: position ? "visible" : "hidden",
            }}
          >
            {actions.map((action) => (
              <li key={action.label}>
                <button
                  type="button"
                  role="menuitem"
                  className={`dropdown-item ${action.danger ? "text-danger" : ""}`}
                  disabled={action.disabled}
                  onClick={() => {
                    setOpen(false);
                    action.onClick();
                  }}
                >
                  <i className={`bi bi-${action.icon} me-2`} />
                  {action.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </>
  );
}
