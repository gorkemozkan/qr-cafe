import { ReactNode } from "react";

interface Props {
  subtitle?: string;
  title: string;
  actions?: ReactNode;
}

const PageTitle = (props: Props) => {
  if (props.actions) {
    return (
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold">{props.title}</h1>
          {props.subtitle && <p className="text-sm text-muted-foreground">{props.subtitle}</p>}
        </div>
        {props.actions}
      </div>
    );
  }

  return <h1 className="text-2xl font-bold"> {props.title}</h1>;
};

export default PageTitle;
