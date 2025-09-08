import { FC } from "react";
import { Tooltip } from "./ui/tooltip";
import { TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "./ui/tooltip";

interface Props {
  onClick: () => void;
  tooltip: string;
  children: React.ReactNode;
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
