"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import TooltipButton from "@/components/common/TooltipButton";
import { Button } from "@/components/ui/button";

interface Props {
  url: string;
}

const ExternalLinkButton: FC<Props> = (props) => {
  return (
    <TooltipButton onClick={() => window.open(props.url, "_blank")} tooltip="Open in new tab">
      <Button asChild variant="outline" size="sm">
        <Link href={props.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4" />
        </Link>
      </Button>
    </TooltipButton>
  );
};

export default ExternalLinkButton;
