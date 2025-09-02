import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

export default function Layout(props: Props) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">{props.children}</div>
    </div>
  );
}
