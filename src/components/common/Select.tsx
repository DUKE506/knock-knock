"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function Select({
  label,
  error,
  required,
  helperText,
  options,
  placeholder = "선택하세요",
  value,
  onChange,
  onBlur,
  name,
  disabled,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onBlur]);

  const handleSelect = (optValue: string) => {
    onChange?.(optValue);
    setOpen(false);
    onBlur?.();
  };

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-text mb-2">
          {label}
          {required && <span className="text-red ml-1">*</span>}
        </label>
      )}

      <div ref={containerRef} className="relative">
        {/* Hidden input for form value */}
        <input type="hidden" name={name} value={value ?? ""} />

        {/* Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={`
            w-full px-3 py-2 text-sm border rounded-sm outline-none transition-colors
            flex items-center justify-between text-left
            ${
              error
                ? "border-red"
                : open
                  ? "border-accent"
                  : "border-border hover:border-border-2"
            }
            ${disabled ? "bg-bg cursor-not-allowed opacity-60" : "bg-surface cursor-pointer"}
          `}
        >
          <span className={selectedOption ? "text-text" : "text-text-3"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-text-3 transition-transform duration-150 shrink-0 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-md shadow-md overflow-hidden animate-scaleIn">
            <ul className="max-h-52 overflow-y-auto py-1">
              {options.length === 0 ? (
                <li className="px-3 py-2 text-sm text-text-3 text-center">
                  항목이 없습니다
                </li>
              ) : (
                options.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`
                        w-full px-3 py-2 text-sm text-left flex items-center justify-between gap-2 transition-colors
                        ${
                          value === opt.value
                            ? "bg-accent-dim text-accent font-medium"
                            : "text-text hover:bg-accent-dim"
                        }
                      `}
                    >
                      <span>{opt.label}</span>
                      {value === opt.value && (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Error / Helper */}
      {error && <p className="text-xs text-red mt-1">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-text-3 mt-1">{helperText}</p>
      )}
    </div>
  );
}
