import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 767 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    // Initial check in case resize didn't trigger yet
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

export const useIsTab = () => {
  const [isTab, setIsTab] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth <= 1023
  );

  useEffect(() => {
    const handleResize = () => {
      setIsTab(window.innerWidth >= 768 && window.innerWidth <= 1023);
    };

    window.addEventListener('resize', handleResize);

    // Run immediately to ensure correct state
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isTab;
};

