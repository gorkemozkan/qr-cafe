import { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

const Page: FC<Props> = (props) => {
  return <div className="flex flex-1 flex-col max-w-6xl mx-auto py-12 px-6 gap-12">{props.children}</div>;
};

export default Page;
