import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80',
        primary: 'border-transparent bg-primary text-white hover:bg-primary/80',
        secondary: 'border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80',
        success: 'border-transparent bg-success text-white hover:bg-success/80',
        warning: 'border-transparent bg-warning text-neutral-900 hover:bg-warning/80',
        danger: 'border-transparent bg-danger text-white hover:bg-danger/80',
        info: 'border-transparent bg-info text-white hover:bg-info/80',
        outline: 'text-neutral-700 border-neutral-300',
        'outline-primary': 'text-primary border-primary',
        'outline-success': 'text-success border-success',
        'outline-warning': 'text-warning border-warning',
        'outline-danger': 'text-danger border-danger',
        'outline-info': 'text-info border-info',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants, type BadgeProps };