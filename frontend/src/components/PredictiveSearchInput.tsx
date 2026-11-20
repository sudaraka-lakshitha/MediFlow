// A search box that suggests matches while typing.

import { useId, useMemo, useState, type KeyboardEvent } from 'react';
import { fuzzySuggestions } from '../utils/fuzzy';

export function PredictiveSearchInput({ value, onChange, suggestions, placeholder, className = 'form-control', minLength = 1, ariaLabel }: {
  value: string; onChange(value: string): void; suggestions: string[]; placeholder?: string; className?: string; minLength?: number; ariaLabel?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useId();
  const matches = useMemo(() => value.trim().length >= minLength ? fuzzySuggestions([...new Set(suggestions.filter(Boolean))], value, 10) : [...new Set(suggestions.filter(Boolean))].slice(0, 10), [suggestions, value, minLength]);
  const choose = (suggestion: string) => { onChange(suggestion); setFocused(false); setActiveIndex(-1); };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActiveIndex((index) => Math.min(index + 1, matches.length - 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex((index) => Math.max(index - 1, 0)); }
    else if (event.key === 'Enter' && activeIndex >= 0 && matches[activeIndex]) { event.preventDefault(); choose(matches[activeIndex]); }
    else if (event.key === 'Escape') { setFocused(false); setActiveIndex(-1); }
  };
  return <div className="search-select predictive-search">
    <input className={`${className} search-select-input`} role="combobox" aria-label={ariaLabel || placeholder || 'Search suggestions'} aria-expanded={focused && matches.length > 0} aria-controls={listId} aria-autocomplete="list" aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined} value={value} placeholder={placeholder} autoComplete="off" onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => { setFocused(false); setActiveIndex(-1); }, 140)} onChange={(event) => { onChange(event.target.value); setActiveIndex(0); }} onKeyDown={onKeyDown} />
    <i className="bi bi-search search-select-icon" aria-hidden="true" />
    {focused && matches.length > 0 && <div id={listId} className="search-select-menu" role="listbox">{matches.map((suggestion, index) => <button id={`${listId}-${index}`} role="option" aria-selected={index === activeIndex} type="button" key={suggestion} onMouseDown={(event) => event.preventDefault()} onMouseEnter={() => setActiveIndex(index)} onClick={() => choose(suggestion)} className={index === activeIndex ? 'selected' : ''}><span>{suggestion}</span></button>)}</div>}
  </div>;
}
