import { useMemo, useState } from 'react';
import { fuzzySuggestions } from '../utils/fuzzy';

export function PredictiveSearchInput({ value, onChange, suggestions, placeholder, className = 'form-control', minLength = 1 }: {
  value: string; onChange(value: string): void; suggestions: string[]; placeholder?: string; className?: string; minLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  const matches = useMemo(() => value.trim().length >= minLength ? fuzzySuggestions([...new Set(suggestions.filter(Boolean))], value, 10) : [...new Set(suggestions.filter(Boolean))].slice(0, 10), [suggestions, value, minLength]);
  return <div className="search-select predictive-search"><input className={`${className} search-select-input`} value={value} placeholder={placeholder} autoComplete="off" onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 140)} onChange={(event) => onChange(event.target.value)} /><i className="bi bi-search search-select-icon" />{focused && matches.length > 0 && <div className="search-select-menu">{matches.map((suggestion) => <button type="button" key={suggestion} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(suggestion); setFocused(false); }}><span>{suggestion}</span></button>)}</div>}</div>;
}
