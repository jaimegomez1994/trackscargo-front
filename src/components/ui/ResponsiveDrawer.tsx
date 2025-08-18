import { useMobileDetection } from '../../hooks/useMobileDetection';
import { SlideIn } from './SlideIn';

interface ResponsiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string; // Used on desktop, mobile gets full-screen
  zIndex?: number;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

export function ResponsiveDrawer({
  isOpen,
  onClose,
  title,
  children,
  width = 'w-96', // Default slide-in width for desktop
  zIndex = 50,
  closeOnBackdrop = true,
  closeOnEscape = true
}: ResponsiveDrawerProps) {
  const isMobile = useMobileDetection();

  // Mobile: Full-screen slide-in, Desktop: Custom width slide-in
  const responsiveWidth = isMobile ? 'w-screen' : width;

  return (
    <SlideIn
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width={responsiveWidth}
      zIndex={zIndex}
      closeOnBackdrop={closeOnBackdrop}
      closeOnEscape={closeOnEscape}
    >
      {children}
    </SlideIn>
  );
}

export default ResponsiveDrawer;