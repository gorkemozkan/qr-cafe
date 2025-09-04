import { FC } from "react";
import { Tables } from "@/types/db";
import { OptimizedImage } from "../ui/optimized-image";

interface Props {
  cafe: Tables<"cafes">;
}

const MenuHeader: FC<Props> = (props) => {
  const { cafe } = props;

  return (
    <header className="flex items-center justify-between w-full">
      <h1 className="text-[75px] font-light italic text-[#8B1538] tracking-wide" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}>
        Menü
      </h1>

      <div className="flex flex-col space-y-2 items-center">
        {cafe.logo_url && (
          <OptimizedImage
            src={cafe.logo_url}
            alt={`${cafe.slug} logo`}
            width={64}
            height={64}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg"
            fallbackSrc="/placeholder-logo.svg"
            priority
          />
        )}
        <h2 className="text-2xl uppercase text-[#8B1538] font-medium">{cafe.slug}</h2>
      </div>
    </header>
  );
};

export default MenuHeader;
