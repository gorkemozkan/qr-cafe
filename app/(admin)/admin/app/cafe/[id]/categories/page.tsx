import { NextPage } from "next";
import { getTranslations } from "next-intl/server";
import CategoryList from "@/components/category/CategoryList";
import PageTitle from "@/components/common/PageTitle";

interface Props {
  params: Promise<{ id: string }>;
}

const CategoriesPage: NextPage<Props> = async (props) => {
  const params = await props.params;
  const t = await getTranslations("category.page");

  const cafeId = Number.parseInt(params.id as string, 10);

  return (
    <>
      <PageTitle showBackButton title={t("title")} subtitle={t("subtitle")} />
      <CategoryList cafeId={cafeId} />
    </>
  );
};

export default CategoriesPage;
