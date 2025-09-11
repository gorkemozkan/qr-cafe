import { FC, PropsWithChildren } from "react";
import DashboardBackground from "@/components/common/DashboardBackground";

interface Props extends PropsWithChildren {}

const Page: FC<Props> = (props) => {
  return (
    <>
      <DashboardBackground />
      <div className="relative flex flex-1 flex-col max-w-6xl mx-auto py-12 px-6 gap-12">{props.children}</div>
    </>
  );
};

export default Page;
