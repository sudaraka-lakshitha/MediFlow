import { useEffect } from 'react';

// Legacy screens predate the shared form-field components. This bridge links their
// visible labels to the immediately adjacent control while those screens are migrated.
export function FormAccessibilityBridge() {
  useEffect(() => {
    let sequence = 0;
    const connectLabels = () => {
      document.querySelectorAll<HTMLLabelElement>('label.form-label:not([for])').forEach((label) => {
        if (label.querySelector('input, select, textarea')) return;
        const sibling = label.nextElementSibling;
        let control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null = null;
        if (sibling?.matches('input, select, textarea')) control = sibling as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        else control = sibling?.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea') || null;
        if (!control) {
          const candidates = label.parentElement?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(':scope > input, :scope > select, :scope > textarea, :scope > .input-group input, :scope > .search-select input');
          if (candidates?.length === 1) control = candidates[0];
        }
        if (!control) return;
        if (!control.id) control.id = `mediflow-field-${++sequence}`;
        label.htmlFor = control.id;
      });
      document.querySelectorAll<HTMLElement>('.table-responsive:not([tabindex])').forEach((region) => {
        region.tabIndex = 0;
        region.setAttribute('role', 'region');
        const heading = region.closest('.panel')?.querySelector('h2, h3, h4')?.textContent?.trim();
        region.setAttribute('aria-label', `${heading || 'Data table'}; scroll horizontally to view all columns`);
        region.classList.add('scrollable-table-region');
      });
      document.querySelectorAll<HTMLElement>('.table-responsive:not([tabindex])').forEach((region) => {
        region.tabIndex = 0;
        region.setAttribute('role', 'region');
        const heading = region.closest('.panel')?.querySelector('h2, h3, h4')?.textContent?.trim();
        region.setAttribute('aria-label', `${heading || 'Data table'}; scroll horizontally to view all columns`);
        region.classList.add('scrollable-table-region');
      });
    };
    connectLabels();
    const observer = new MutationObserver(connectLabels);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
