"use client";

import { Button } from "@/components/ui/button";

interface SkipLinkProps {
  targetId: string;
  children: React.ReactNode;
}

const SkipLink = ({ targetId, children }: SkipLinkProps) => {
  const handleSkip = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:border-ring focus:shadow-lg"
      aria-label={`Skip to ${children}`}
    >
      {children}
    </Button>
  );
};

export default SkipLink;
