import { ExternalLink } from "lucide-react";
import { FC } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  url: string;
}

const ExternalLinkButton: FC<Props> = (props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild variant="outline" size="sm">
          <Link href={props.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Open in new tab</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ExternalLinkButton;
