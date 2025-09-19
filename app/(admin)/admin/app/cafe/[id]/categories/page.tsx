import { NextPage } from "next";
import { parseNumericId } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import PageTitle from "@/components/common/PageTitle";
import CategoryList from "@/components/category/CategoryList";

interface Props {
  params: Promise<{ id: string }>;
}

const CategoriesPage: NextPage<Props> = async (props) => {
  const params = await props.params;

  const t = await getTranslations("category.page");

  const cafeId = parseNumericId(params.id);

  return (
    <>
      <PageTitle showBackButton title={t("title")} subtitle={t("subtitle")} />
      <CategoryList cafeId={cafeId} />
    </>
  );
};

export default CategoriesPage;
