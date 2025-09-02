import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

export default function Page(props: Props) {
  return <div className="flex flex-1 flex-col max-w-7xl mx-auto pt-12 px-6 gap-12">{props.children}</div>;
}
