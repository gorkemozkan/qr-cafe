import { FC } from "react";
import CategoryList from "@/components/category/CategoryList";
import PageTitle from "@/components/PageTitle";
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
      <PageTitle showBackButton title="Categories" subtitle="Manage categories for your cafe" />
      <CategoryList cafeId={cafeId} />
    </div>
  );
};

export default CategoriesPage;
