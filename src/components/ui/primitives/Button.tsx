import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-primary hover:bg-primary-dark text-white focus:ring-primary',
        secondary: 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-500',
        outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
        ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500',
        danger: 'bg-danger hover:bg-red-700 text-white focus:ring-danger',
        success: 'bg-success hover:bg-green-700 text-white focus:ring-success',
        blue: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      },
      size: {
        xs: 'px-2 py-1 text-xs rounded',
        sm: 'px-3 py-2 text-sm rounded min-h-[36px]', // Better mobile touch target
        md: 'px-4 py-2 text-sm rounded-md min-h-[40px]',
        lg: 'px-6 py-3 text-base rounded-md min-h-[44px]',
        xl: 'px-8 py-4 text-lg rounded-lg min-h-[48px]',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: React.ElementType;
  // Allow any additional props when using 'as'
  [key: string]: any;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    children,
    as: Component = 'button',
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    
    return (
      <Component
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {typeof children === 'string' ? `${children}...` : children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants, type ButtonProps };