import React from "react";

interface Props {
  title: string;
  actions?: React.ReactNode;
}

const PageTitle = (props: Props) => {
  if (props.actions) {
    return (
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl font-bold">{props.title}</h1>
        {props.actions}
      </div>
    );
  }

  return <h1 className="text-2xl font-bold"> {props.title}</h1>;
};

export default PageTitle;
