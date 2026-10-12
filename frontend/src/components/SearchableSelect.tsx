import { useEffect, useId, useMemo, useState, type KeyboardEvent } from 'react';
import { fuzzyMatchScore } from '../utils/fuzzy';
import { useDebouncedValue } from '../utils/useDebouncedValue';

export type SelectOption = { value: string | number; label: string; description?: string };

export function SearchableSelect({ options, value, onChange, onQueryChange, placeholder = 'Search and select', required = false, disabled = false, ariaLabel }: {
  options: SelectOption[]; value: string | number | null | undefined; onChange(value: string | number): void;
  onQueryChange?(query: string): void;
  placeholder?: string; required?: boolean; disabled?: boolean; ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useId();
  const debouncedQuery = useDebouncedValue(query, 250);
  useEffect(() => { if (onQueryChange) onQueryChange(debouncedQuery.trim()); }, [debouncedQuery, onQueryChange]);
  const selected = options.find((option) => String(option.value) === String(value));
  const filtered = useMemo(() => {
    const term = query.trim();
    return (term ? options.map((option) => ({ option, score: fuzzyMatchScore(option, term) })).filter((entry) => Number.isFinite(entry.score)).sort((first, second) => first.score - second.score || first.option.label.localeCompare(second.option.label)).map((entry) => entry.option) : options).slice(0, term ? 30 : 80);
  }, [options, query]);
  const choose = (option: SelectOption) => { onChange(option.value); setOpen(false); setQuery(''); setActiveIndex(-1); };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); setActiveIndex((index) => Math.min(index + 1, filtered.length - 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); setActiveIndex((index) => Math.max(index - 1, 0)); }
    else if (event.key === 'Enter' && open && activeIndex >= 0 && filtered[activeIndex]) { event.preventDefault(); choose(filtered[activeIndex]); }
    else if (event.key === 'Escape') { setOpen(false); setActiveIndex(-1); }
  };
  return <div className="search-select">
    <input className="form-control search-select-input" role="combobox" aria-label={ariaLabel || placeholder} aria-expanded={open} aria-controls={listId} aria-autocomplete="list" aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined} disabled={disabled} required={required && !selected} value={open ? query : selected?.label || ''} placeholder={placeholder}
      onFocus={() => { setQuery(''); setOpen(true); setActiveIndex(-1); }} onChange={(event) => { setQuery(event.target.value); setOpen(true); setActiveIndex(0); }} onKeyDown={onKeyDown} onBlur={() => setTimeout(() => { setOpen(false); setActiveIndex(-1); }, 140)} />
    <i className={`bi bi-${open ? 'chevron-up' : 'search'} search-select-icon`} aria-hidden="true" />
    {open && <div id={listId} className="search-select-menu" role="listbox">{filtered.map((option, index) => <button id={`${listId}-${index}`} role="option" aria-selected={String(option.value) === String(value)} type="button" key={option.value} onMouseDown={(event) => event.preventDefault()} onMouseEnter={() => setActiveIndex(index)} onClick={() => choose(option)} className={index === activeIndex || String(option.value) === String(value) ? 'selected' : ''}><span>{option.label}</span>{option.description && <small>{option.description}</small>}</button>)}{!filtered.length && <div className="search-select-empty" role="status">No matching records</div>}</div>}
  </div>;
}
