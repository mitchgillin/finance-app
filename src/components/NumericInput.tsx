import React, { useState, useEffect } from "react";

interface NumericInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number | string;
  prefix?: string;
  suffix?: string;
  defaultValue?: number;
  placeholder?: string;
  className?: string;
}

export default function NumericInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  defaultValue = 0,
  placeholder,
  className = "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
}: NumericInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Parse shorthand notation (2.5k, 15M, etc.)
  const parseShorthand = (input: string): number => {
    const cleanInput = input.replace(/,/g, "").trim().toLowerCase();

    if (cleanInput === "") return defaultValue;

    // Handle shorthand suffixes
    const suffixMap: { [key: string]: number } = {
      k: 1000,
      m: 1000000,
      b: 1000000000,
    };

    const lastChar = cleanInput.slice(-1);
    if (suffixMap[lastChar]) {
      const numPart = cleanInput.slice(0, -1);
      const num = parseFloat(numPart);
      if (!isNaN(num)) {
        return num * suffixMap[lastChar];
      }
    }

    const num = parseFloat(cleanInput);
    return isNaN(num) ? defaultValue : num;
  };

  // Format number with commas for display
  const formatWithCommas = (num: number): string => {
    if (num === 0 && !isFocused) return "";
    return new Intl.NumberFormat("en-US").format(num);
  };

  // Update display value when prop value changes
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatWithCommas(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    // Parse and update value in real-time
    const numValue = parseShorthand(inputValue);
    onChange(numValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number without commas when focused for easier editing
    setDisplayValue(value === 0 ? "" : value.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numValue = parseShorthand(displayValue);
    onChange(numValue);
    // Format with commas when not focused
    setDisplayValue(formatWithCommas(numValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow shorthand letters
    if (["k", "K", "m", "M", "b", "B"].includes(e.key)) {
      return;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full ${prefix ? "pl-8" : "pl-4"} ${
            suffix ? "pr-12" : "pr-4"
          } py-3 border border-gray-300 rounded-lg ${className}`}
          placeholder={placeholder || "e.g., 2.5k, 15M, 1000"}
        />
        {suffix && (
          <span
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 ${
              suffix.length > 1 ? "right-4" : "right-3"
            }`}
          >
            {suffix}
          </span>
        )}
      </div>
      {/* Helper text for shorthand */}
      <div className="mt-1 text-xs text-gray-500">
        Supports: 2.5k (thousands), 15M (millions), 1B (billions)
      </div>
    </div>
  );
}
