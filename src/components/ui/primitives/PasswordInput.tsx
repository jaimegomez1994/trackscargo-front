import { useState, forwardRef } from 'react';

export interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  autoComplete?: string;
  className?: string;
  hasError?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ 
    id, 
    name, 
    value, 
    onChange, 
    placeholder = "Enter password",
    required = false,
    disabled = false,
    minLength,
    autoComplete = "new-password",
    className = "",
    hasError = false
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const baseClasses = "appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50";
    const errorClasses = hasError 
      ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
      : "border-gray-300";

    return (
      <div className="relative">
        <input
          ref={ref}
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          disabled={disabled}
          minLength={minLength}
          className={`${baseClasses} ${errorClasses} ${className}`}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? (
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L18.586 18.586M7.05 16.95A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.024 10.024 0 01-1.563 3.029m-5.858-.908a3 3 0 01-4.243-4.243" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';