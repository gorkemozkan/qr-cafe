import { FC, PropsWithChildren } from "react";
import FancyBackground from "@/components/landing/FancyBackground";

interface Props extends PropsWithChildren {}

const Page: FC<Props> = (props) => {
  return (
    <div className="flex flex-1 flex-col max-w-7xl mx-auto py-12 px-6 gap-12 relative">
      <FancyBackground />
      {props.children}
    </div>
  );
};

export default Page;
