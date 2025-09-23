import { FC, ReactNode } from "react";

interface Props {
  title?: string;
  actions?: ReactNode;
}

export const DataTableHeader: FC<Props> = (props) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      {props.title ? <h2 className="text-xl font-semibold">{props.title}</h2> : <div />}
      <div className="flex justify-end gap-2">{props.actions}</div>
    </div>
  );
};
