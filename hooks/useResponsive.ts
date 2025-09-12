import { useState, useEffect } from "react";

interface UseResponsiveOptions {
  breakpoint?: number;
}

interface UseResponsiveReturn {
  isMobile: boolean;
}

export function useResponsive({ breakpoint = 768 }: UseResponsiveOptions = {}): UseResponsiveReturn {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [breakpoint]);

  return { isMobile };
}
