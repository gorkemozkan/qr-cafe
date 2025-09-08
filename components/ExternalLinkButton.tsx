"use client";

import { FC } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import TooltipButton from "@/components/TooltipButton";

interface Props {
  url: string;
}

const ExternalLinkButton: FC<Props> = (props) => {
  const tCommon = useTranslations("common");
  return (
    <TooltipButton onClick={() => window.open(props.url, "_blank")} tooltip={tCommon("openInNewTab")}>
      <Button asChild variant="outline" size="sm">
        <Link href={props.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4" />
        </Link>
      </Button>
    </TooltipButton>
  );
};

export default ExternalLinkButton;
