import React from 'react';
import { cn } from '../../../lib/utils';

interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  htmlFor?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ 
    label,
    description,
    error,
    required,
    children,
    className,
    labelClassName,
    htmlFor,
    ...props 
  }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <label
            htmlFor={htmlFor}
            className={cn(
              'block text-sm font-medium text-neutral-700',
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        
        {description && (
          <p className="text-xs text-neutral-500">{description}</p>
        )}
        
        <div className="relative">
          {children}
        </div>
        
        {error && (
          <p className="text-sm text-danger flex items-center gap-1">
            <svg
              className="h-4 w-4 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField, type FormFieldProps };