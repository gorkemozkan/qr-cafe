"use client";

import { useState } from "react";
import { NextPage } from "next";
import Spinner from "@/components/Spinner";
import { AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import QueryKeys from "@/lib/query";
import PageTitle from "@/components/PageTitle";
import { useQueryRequest } from "@/hooks/useRequest";
import { categoryRepository } from "@/lib/repositories";
import ProductList from "@/components/product/ProductList";
import CategoryEditModal from "@/components/category/CategoryEditModal";

const Page: NextPage = () => {
  const params = useParams();

  const t = useTranslations();

  const cafeId = parseInt(params.id as string, 10);

  const categoryId = parseInt(params.categoryId as string, 10);

  const [showEditModal, setShowEditModal] = useState(false);

  const { data: category, isLoading: isLoadingCategory } = useQueryRequest({
    queryKey: QueryKeys.category(categoryId.toString()),
    queryFn: async () => {
      return await categoryRepository.getById(categoryId);
    },
  });

  if (isLoadingCategory) {
    return <Spinner />;
  }

  if (!category) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>{t("category.notFound")}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageTitle showBackButton title={category.name} subtitle={t("category.manageProducts")} />
      <ProductList cafeId={cafeId} categoryId={categoryId} />
      {showEditModal && (
        <CategoryEditModal
          category={category}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Page;
