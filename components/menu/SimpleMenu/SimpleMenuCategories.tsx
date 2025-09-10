import { FC } from "react";
import { PublicCategory } from "@/lib/repositories/public-menu-repository";
import { Button } from "@/components/ui/button";

interface Props {
  categories: PublicCategory[];
  activeCategoryId: number;
  onChange: (categoryId: number) => void;
}

const SimpleMenuCategories: FC<Props> = (props) => {
  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto">
      {props.categories.map((category) => (
        <Button
          key={category.id}
          variant={props.activeCategoryId === category.id ? "default" : "secondary"}
          size="lg"
          onClick={() => props.onChange(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default SimpleMenuCategories;
