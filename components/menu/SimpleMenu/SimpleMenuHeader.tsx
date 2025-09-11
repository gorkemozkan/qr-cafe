import Image from "next/image";
import { FC } from "react";

interface Props {
  logoUrl: string | null;
}

const SimpleMenuHeader: FC<Props> = (props) => {
  return (
    <header className="relative mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-center w-full">
        {props.logoUrl ? (
          <Image src={props.logoUrl} alt="Logo" width={120} height={120} quality={100} priority />
        ) : (
          <h1
            className="text-7xl font-light italic text-[#8B1538] dark:text-[#A61E4D] tracking-wide leading-none text-center"
            style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}
          >
            Menu
          </h1>
        )}
      </div>
      <div className="mt-8 relative">
        <div className="h-px  bg-gradient-to-r from-transparent via-[#8B1538]/20 to-transparent " />
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4">
          <div className="w-2 h-2 bg-[#8B1538]/20 dark:bg-[#A61E4D]/40 rounded-full animate-pulse" />
        </div>
      </div>
    </header>
  );
};

export default SimpleMenuHeader;
