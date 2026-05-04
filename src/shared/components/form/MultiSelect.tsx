'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, X, Search, Check } from 'lucide-react';

export interface MultiSelectOption {
  value: number;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: number[];
  onChange: (value: number[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  id?: string;
  disabled?: boolean;
  error?: boolean;
}

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhum item disponível.',
  id,
  disabled = false,
  error = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (open) searchInputRef.current?.focus();
  }, [open]);

  const selectedOptions = useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const toggle = (optionValue: number) => {
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue]
    );
  };

  const removeChip = (optionValue: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const triggerBase =
    'flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm shadow-theme-xs focus:outline-hidden';
  const triggerState = disabled
    ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
    : error
      ? 'border-error-500 bg-white focus:ring-3 focus:ring-error-500/10 dark:border-error-500 dark:bg-gray-900'
      : 'border-gray-300 bg-white focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800';

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`${triggerBase} ${triggerState}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex flex-1 flex-wrap gap-1.5">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-400 dark:text-white/30">{placeholder}</span>
          ) : (
            selectedOptions.map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 rounded-md bg-brand-50 py-0.5 pr-1 pl-2 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
              >
                {opt.label}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => removeChip(opt.value, e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      removeChip(opt.value, e as unknown as React.MouseEvent);
                    }
                  }}
                  aria-label={`Remover ${opt.label}`}
                  className="rounded p-0.5 hover:bg-brand-100 dark:hover:bg-brand-500/30"
                >
                  <X size={12} />
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-500 transition-transform dark:text-gray-400 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="shadow-theme-lg absolute left-0 z-40 mt-2 w-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 p-2 dark:border-gray-800">
            <div className="relative">
              <Search
                size={14}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-md border border-gray-200 bg-white pr-3 pl-8 text-sm focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>
          </div>

          <ul
            role="listbox"
            aria-multiselectable="true"
            className="max-h-60 overflow-y-auto py-1"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs text-gray-400 dark:text-gray-500">
                {options.length === 0 ? emptyMessage : 'Nenhum resultado para a busca.'}
              </li>
            ) : (
              filteredOptions.map((opt) => {
                const selected = value.includes(opt.value);
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => toggle(opt.value)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                        selected
                          ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selected && <Check size={14} className="shrink-0" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {value.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2 dark:border-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {value.length} selecionado(s)
              </span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Limpar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
