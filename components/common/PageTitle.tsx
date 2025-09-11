"use client";

import { FC, ReactNode } from "react";
import BackButton from "@/components/common/BackButton";

interface Props {
  subtitle?: string;
  title: string;
  actions?: ReactNode;
  showBackButton?: boolean;
}

const PageTitle: FC<Props> = (props) => {
  if (props.actions) {
    return (
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold">{props.title}</h1>
          {props.subtitle && <p className="text-sm text-muted-foreground">{props.subtitle}</p>}
          {props.showBackButton && <BackButton noText />}
        </div>
        {props.actions}
      </div>
    );
  }

  if (props.subtitle) {
    return (
      <div className="flex flex-col gap-4 items-start">
        {props.showBackButton && <BackButton noText />}
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
