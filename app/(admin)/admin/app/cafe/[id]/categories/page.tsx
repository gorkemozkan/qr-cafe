import { FC } from "react";
import CategoryList from "@/components/category/CategoryList";
import CategoryCreateModal from "@/components/category/CategoryCreateModal";

interface Props {
  params: Promise<{ id: string }>;
}

const CategoriesPage: FC<Props> = async (props) => {
  const params = await props.params;

  const cafeId = parseInt(params.id as string, 10);

  if (Number.isNaN(cafeId)) {
    return <div>Invalid cafe ID</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage categories for your cafe</p>
        </div>
        <CategoryCreateModal cafeId={cafeId} />
      </div>
      <CategoryList cafeId={cafeId} />
    </div>
  );
};

export default CategoriesPage;
