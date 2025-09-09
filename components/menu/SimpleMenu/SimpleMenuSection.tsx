import { FC } from "react";

interface Props {
  title: string;
  items: string[];
}

const SimpleMenuSection: FC<Props> = (props) => {
  const { title, items } = props;

  return (
    <div className=" rounded-lg">
      <h3 className="text-lg font-bold text-[#8B1538] dark:text-[#A61E4D] uppercase tracking-wide mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="text-[#8B1538] dark:text-[#A61E4D] text-sm font-medium leading-relaxed">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleMenuSection;
