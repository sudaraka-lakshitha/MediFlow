import { useMemo, useState } from 'react';
import { fuzzyMatchScore } from '../utils/fuzzy';

export type SelectOption = { value: string | number; label: string; description?: string };

export function SearchableSelect({ options, value, onChange, placeholder = 'Search and select', required = false, disabled = false }: {
  options: SelectOption[]; value: string | number | null | undefined; onChange(value: string | number): void;
  placeholder?: string; required?: boolean; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false); const [query, setQuery] = useState('');
  const selected = options.find((option) => String(option.value) === String(value));
  const filtered = useMemo(() => { const term = query.trim(); return (term ? options.map((option) => ({ option, score: fuzzyMatchScore(option, term) })).filter((entry) => Number.isFinite(entry.score)).sort((first, second) => first.score - second.score || first.option.label.localeCompare(second.option.label)).map((entry) => entry.option) : options).slice(0, term ? 30 : 80); }, [options, query]);
  return <div className="search-select">
    <input className="form-control search-select-input" disabled={disabled} required={required && !selected} value={open ? query : selected?.label || ''} placeholder={placeholder}
      onFocus={() => { setQuery(''); setOpen(true); }} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onBlur={() => setTimeout(() => setOpen(false), 140)} />
    <i className={`bi bi-${open ? 'chevron-up' : 'search'} search-select-icon`} />
    {open && <div className="search-select-menu">{filtered.map((option) => <button type="button" key={option.value} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(option.value); setOpen(false); setQuery(''); }} className={String(option.value) === String(value) ? 'selected' : ''}><span>{option.label}</span>{option.description && <small>{option.description}</small>}</button>)}{!filtered.length && <div className="search-select-empty">No matching records</div>}</div>}
  </div>;
}
