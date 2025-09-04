import { NextPage } from "next";
import PageTitle from "@/components/PageTitle";
import CategoryList from "@/components/category/CategoryList";

interface Props {
  params: Promise<{ id: string }>;
}

const CategoriesPage: NextPage<Props> = async (props) => {
  const params = await props.params;

  const cafeId = Number.parseInt(params.id as string, 10);

  return (
    <div>
      <PageTitle showBackButton title="Categories" subtitle="Manage categories for your cafe" />
      <CategoryList cafeId={cafeId} />
    </div>
  );
};

export default CategoriesPage;
