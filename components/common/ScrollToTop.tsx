"use client";

import { ArrowUp } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const ScrollToTop: FC = () => {
  const t = useTranslations("common");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 p-0 rounded-full bg-orange-500 hover:bg-orange-500/90 dark:bg-orange-500 dark:hover:bg-orange-500/90 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-3"
      aria-label={t("scrollToTop")}
    >
      <ArrowUp className="w-8 h-8 text-white" />
    </Button>
  );
};

export default ScrollToTop;
