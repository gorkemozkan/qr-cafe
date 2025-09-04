"use client";

import { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  targetId: string;
  children: ReactNode;
}

const SkipLink: FC<Props> = (props) => {
  const handleSkip = () => {
    const target = document.getElementById(props.targetId);
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
      aria-label={`Skip to ${props.children}`}
    >
      {props.children}
    </Button>
  );
};

export default SkipLink;
