"use client";

import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import BackButton from "@/components/common/BackButton";

interface Props {
  subtitle?: string;
  title: string;
  actions?: ReactNode;
  showBackButton?: boolean;
}

const PageTitle: FC<Props> = (props) => {
  const titleClasses = cn(
    "text-3xl sm:text-4xl font-black tracking-tight",
    "bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent",
    "animate-in slide-in-from-left-2 fade-in-0 duration-700",
  );

  const subtitleClasses = cn(
    "text-sm sm:text-base text-muted-foreground/80 font-medium",
    "animate-in slide-in-from-left-2 fade-in-0 duration-700 delay-100",
  );

  if (props.actions) {
    return (
      <div className="flex justify-between items-center flex-wrap gap-4 py-2">
        <div className="space-y-2 relative">
          {/* Decorative element */}
          <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-sm animate-pulse" />

          {props.showBackButton && (
            <div className="animate-in slide-in-from-left-2 fade-in-0 duration-500">
              <BackButton noText />
            </div>
          )}

          <div className="space-y-1">
            <h1 className={titleClasses}>{props.title}</h1>
            {props.subtitle && <p className={subtitleClasses}>{props.subtitle}</p>}
          </div>
        </div>

        <div className="animate-in slide-in-from-right-2 fade-in-0 duration-700 delay-200">{props.actions}</div>
      </div>
    );
  }

  if (props.subtitle) {
    return (
      <div className="flex flex-col gap-4 items-start py-2">
        {props.showBackButton && (
          <div className="animate-in slide-in-from-left-2 fade-in-0 duration-500">
            <BackButton noText />
          </div>
        )}

        <div className="space-y-2 relative">
          {/* Decorative element */}
          <div className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-sm animate-pulse delay-300" />

          <h1 className={titleClasses}>{props.title}</h1>
          <p className={subtitleClasses}>{props.subtitle}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 relative">
      {/* Decorative element */}
      <div className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-sm animate-pulse delay-300" />

      <h1 className={titleClasses}>{props.title}</h1>
    </div>
  );
};

export default PageTitle;
