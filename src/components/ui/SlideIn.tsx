import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface SlideInProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
  zIndex?: number;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

export function SlideIn({
  isOpen,
  onClose,
  title,
  children,
  width = 'w-96', // Default width - can be customized
  zIndex = 50,
  closeOnBackdrop = true,
  closeOnEscape = true
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when slide-in is open
      document.body.style.overflow = 'hidden';
    } else {
      // Delay hiding to allow exit animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, closeOnEscape]);

  if (!isVisible) return null;

  const slideInContent = (
    <div 
      className={`fixed inset-0 z-${zIndex} flex justify-end`}
      style={{ zIndex }}
    >
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backdropFilter: 'blur(0.8px)' }}
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Slide-in Panel */}
      <div 
        className={`relative bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${width} h-full flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );

  // Render in portal to avoid z-index issues
  return createPortal(slideInContent, document.body);
}

export default SlideIn;