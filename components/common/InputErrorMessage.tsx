import { FC, ReactNode } from "react";

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

const InputErrorMessage: FC<Props> = (props) => {
  if (!props.children) {
    return null;
  }

  return (
    <p className="text-sm text-red-500" role="alert" aria-live="polite" {...props}>
      {props.children}
    </p>
  );
};

export default InputErrorMessage;
