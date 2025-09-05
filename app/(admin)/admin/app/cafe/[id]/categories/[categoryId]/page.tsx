"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { categoryRepository } from "@/lib/repositories";
import { useQueryRequest } from "@/hooks/use-request";
import { AlertCircle } from "lucide-react";
import ProductList from "@/components/product/ProductList";
import CategoryEditModal from "@/components/category/CategoryEditModal";
import QueryKeys from "@/constants/query-keys";
import { NextPage } from "next";
import PageTitle from "@/components/PageTitle";

const CategoryDetailPage: NextPage = () => {
  const params = useParams();

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
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>Category not found</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageTitle showBackButton title={category.name} subtitle="Manage products for your category" />
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

export default CategoryDetailPage;
