import { NextPage } from "next";
import { getTranslations } from "next-intl/server";
import CategoryList from "@/components/category/CategoryList";
import PageTitle from "@/components/PageTitle";

interface Props {
  params: Promise<{ id: string }>;
}

const CategoriesPage: NextPage<Props> = async (props) => {
  const params = await props.params;

  const t = await getTranslations();

  const cafeId = Number.parseInt(params.id as string, 10);

  return (
    <div>
      <PageTitle showBackButton title={t("category.title")} subtitle={t("category.manageCategories")} />
      <CategoryList cafeId={cafeId} />
    </div>
  );
};

export default CategoriesPage;
