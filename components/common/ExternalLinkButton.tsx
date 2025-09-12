"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  url: string;
}

const ExternalLinkButton: FC<Props> = (props) => {
  return (
    <Button asChild variant="outline">
      <Link href={props.url} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="h-4 w-4" />
      </Link>
    </Button>
  );
};

export default ExternalLinkButton;
