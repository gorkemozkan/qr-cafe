import { Loader2 } from "lucide-react";
import { FC } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  isLoading: boolean;
  text: string;
  onClick?: () => void;
  disabled: boolean;
  loadingText: string;
  type?: "button" | "submit" | "reset";
  form?: string;
}

const SubmitButton: FC<Props> = (props) => {
  return (
    <Button type={props.type || "button"} form={props.form} onClick={props.onClick} disabled={props.isLoading || props.disabled}>
      {props.isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {props.loadingText}
        </>
      ) : (
        props.text
      )}
    </Button>
  );
};

export default SubmitButton;
