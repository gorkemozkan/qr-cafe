"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FC } from "react";
import TooltipButton from "@/components/common/TooltipButton";
import { Button } from "@/components/ui/button";

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
