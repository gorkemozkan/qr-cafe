import { NextPage } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import PageTitle from "@/components/common/PageTitle";
import CategoryList from "@/components/category/CategoryList";

interface Props {
  params: Promise<{ id: string }>;
}

const CategoriesPage: NextPage<Props> = async (props) => {
  const params = await props.params;

  const t = await getTranslations("category.page");

  const cafeId = parseInt(params.id, 10);

  if (Number.isNaN(cafeId)) {
    return notFound();
  }

  return (
    <>
      <PageTitle showBackButton title={t("title")} subtitle={t("subtitle")} />
      <CategoryList cafeId={cafeId} />
    </>
  );
};

export default CategoriesPage;
