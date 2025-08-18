import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Initial value based on window width (with SSR safety)
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export default useMobileDetection;