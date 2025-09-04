import { FC } from "react";

interface Props {
  title: string;
  items: string[];
}

const MenuSection: FC<Props> = (props) => {
  const { title, items } = props;

  return (
    <div className=" rounded-lg">
      <h3 className="text-lg font-bold text-[#8B1538] uppercase tracking-wide mb-4 border-b border-gray-200 pb-2">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="text-[#8B1538] text-sm font-medium leading-relaxed">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
