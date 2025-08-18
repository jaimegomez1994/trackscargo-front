import React from 'react';

type IconButtonVariant = 'edit' | 'copy' | 'delete' | 'view' | 'default';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<IconButtonVariant, string> = {
  edit: 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300',
  copy: 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300',
  delete: 'text-red-700 bg-white hover:bg-red-50 border-red-300',
  view: 'text-blue-700 bg-white hover:bg-blue-50 border-blue-300',
  default: 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
};

const sizes: Record<IconButtonSize, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-xs',
  lg: 'px-3 py-2 text-sm'
};

export function IconButton({
  variant = 'default',
  size = 'md',
  onClick,
  disabled = false,
  children,
  className = ''
}: IconButtonProps) {
  const baseClasses = 'inline-flex items-center border shadow-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
  
  const variantClasses = variants[variant];
  const sizeClasses = sizes[size];
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </button>
  );
}

export default IconButton;