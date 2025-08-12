import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const inputVariants = cva(
  'block w-full border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-neutral-400',
  {
    variants: {
      variant: {
        default: 'border-neutral-300 focus:border-primary focus:ring-primary',
        error: 'border-danger focus:border-danger focus:ring-danger',
        success: 'border-success focus:border-success focus:ring-success',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  success?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size,
    leftIcon,
    rightIcon,
    error,
    success,
    type = 'text',
    ...props 
  }, ref) => {
    // Determine variant based on state
    const computedVariant = error ? 'error' : success ? 'success' : variant;
    
    // If we have icons, we need a wrapper
    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-neutral-400 text-sm">{leftIcon}</span>
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              inputVariants({ variant: computedVariant, size }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-neutral-400 text-sm">{rightIcon}</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        type={type}
        className={cn(inputVariants({ variant: computedVariant, size }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants, type InputProps };