import { FC, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  onClick: () => void;
  tooltip: string;
  children: ReactNode;
}

const TooltipButton: FC<Props> = (props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild onClick={props.onClick}>
        {props.children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{props.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipButton;
