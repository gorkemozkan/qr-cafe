"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  subtitle?: string;
  title: string;
  actions?: ReactNode;
  showBackButton?: boolean;
}

const PageTitle = (props: Props) => {
  const router = useRouter();
  if (props.actions) {
    return (
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold">{props.title}</h1>
          {props.subtitle && <p className="text-sm text-muted-foreground">{props.subtitle}</p>}
          {props.showBackButton && (
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
        {props.actions}
      </div>
    );
  }

  if (props.subtitle) {
    return (
      <div className="flex flex-col gap-4 items-start">
        {props.showBackButton && (
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold">{props.title}</h1>
          <p className="text-sm text-muted-foreground">{props.subtitle}</p>
        </div>
      </div>
    );
  }

  return <h1 className="text-2xl font-bold"> {props.title}</h1>;
};

export default PageTitle;
