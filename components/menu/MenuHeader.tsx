import { FC } from "react";

const MenuHeader: FC = () => {
  return (
    <header className="relative mb-8 animate-in fade-in-50 slide-in-from-top-5 duration-700">
      <div className="flex flex-col sm:flex-row items-center justify-center w-full">
        <h1 className="text-7xl font-light italic text-[#8B1538] tracking-wide leading-none text-center" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}>
          Menu
        </h1>
      </div>

      {/* Decorative divider */}
      <div className="mt-8 relative">
        <div className="h-px bg-gradient-to-r from-transparent via-[#8B1538]/20 to-transparent " />
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4">
          <div className="w-2 h-2 bg-[#8B1538]/20 rounded-full animate-pulse" />
        </div>
      </div>
    </header>
  );
};

export default MenuHeader;
