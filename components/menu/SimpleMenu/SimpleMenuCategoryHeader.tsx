import { FC } from "react";

interface Props {
  categorName: string;
}

const SimpleMenuCategoryHeader: FC<Props> = ({ categorName }) => {
  return (
    <h2 className="mb-6 text-2xl sm:text-3xl font-black text-[#8B1538] dark:text-[#A61E4D] uppercase tracking-wide border-b border-[#8B1538]/10 dark:border-[#8B1538]/10 pb-3 mb-4">
      {categorName.toLocaleUpperCase("tr-TR")}
    </h2>
  );
};

export default SimpleMenuCategoryHeader;
