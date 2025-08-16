import { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  allowCustomInput?: boolean;
  filterFunction?: (options: DropdownOption[], filter: string) => DropdownOption[];
  className?: string;
  dropdownClassName?: string;
  maxHeight?: string;
  maxOptions?: number;
  openOnFocus?: boolean; // New prop to control focus behavior
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  error,
  allowCustomInput = true,
  filterFunction,
  className = '',
  dropdownClassName = '',
  maxHeight = 'max-h-60',
  maxOptions,
  openOnFocus = false
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Default filter function
  const defaultFilter = (opts: DropdownOption[], filterText: string) => {
    return opts.filter(option =>
      option.label.toLowerCase().includes(filterText.toLowerCase())
    );
  };

  const filteredOptions = filterFunction 
    ? filterFunction(options, filter)
    : defaultFilter(options, filter);

  const displayedOptions = maxOptions 
    ? filteredOptions.slice(0, maxOptions)
    : filteredOptions;

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    setFilter(inputValue);
    
    if (openOnFocus) {
      // For status dropdowns: open on any input or if not allowing custom input
      setIsOpen(inputValue.length > 0 || !allowCustomInput);
    } else {
      // Mobile-friendly: require 2+ characters for filtering (location dropdowns)
      setIsOpen(inputValue.length > 1 || !allowCustomInput);
    }
  };

  const handleOptionSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    
    onChange(option.value);
    setIsOpen(false);
    setFilter('');
    // Don't blur immediately, let the selection settle first
    setTimeout(() => {
      inputRef.current?.blur();
    }, 10);
  };

  const handleInputFocus = () => {
    if (openOnFocus) {
      // Always open on focus (for status dropdowns)
      setIsOpen(true);
      if (!allowCustomInput) {
        setFilter('');
      }
    } else {
      // For mobile-friendly behavior, only open if there's already content (for location dropdowns)
      const shouldOpen = value.length > 1 || !allowCustomInput;
      setIsOpen(shouldOpen);
      if (!allowCustomInput) {
        setFilter('');
      }
    }
  };

  const handleInputBlur = () => {
    // Small delay to allow option clicks to register
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        className={`block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-red-300' : ''
        } ${className}`}
      />

      {/* Dropdown Menu */}
      {isOpen && displayedOptions.length > 0 && (
        <div className={`absolute z-50 mt-1 w-full bg-white shadow-lg rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none ${maxHeight} ${dropdownClassName}`}>
          {displayedOptions.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer select-none relative py-3 px-4 transition-colors ${
                option.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'hover:bg-blue-600 hover:text-white'
              }`}
              onMouseDown={(e) => {
                // Prevent input blur when clicking option
                e.preventDefault();
                handleOptionSelect(option);
              }}
            >
              <span className="block truncate font-normal">{option.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default Dropdown;