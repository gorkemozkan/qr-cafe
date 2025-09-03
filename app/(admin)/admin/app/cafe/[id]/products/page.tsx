"use client";

import { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tables } from "@/types/db";
import { categoryRepository } from "@/lib/repositories";
import { useRequest } from "@/hooks/use-request";
import ProductList from "@/components/cafe/ProductList";
import ProductCreateModal from "@/components/cafe/ProductCreateModal";

const ProductsPage: FC = () => {
  const params = useParams();
  const cafeId = parseInt(params.id as string, 10);
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);

  const { isLoading: isLoadingCategories, execute: fetchCategories } = useRequest({
    mutationFn: async () => {
      return await categoryRepository.listByCafe(cafeId);
    },
    onSuccess: (data) => {
      setCategories(data);
    },
  });

  useEffect(() => {
    if (cafeId) {
      fetchCategories();
    }
  }, [cafeId, fetchCategories]);

  if (Number.isNaN(cafeId)) {
    return <div>Invalid cafe ID</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage products for your cafe</p>
        </div>
        {!isLoadingCategories && categories.length > 0 && (
          <ProductCreateModal
            cafeId={cafeId}
            categories={categories}
            onSuccess={() => {
              // Products will be refreshed automatically via query invalidation
            }}
          />
        )}
      </div>

      {isLoadingCategories ? (
        <div>Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You need to create categories before adding products.</p>
          <a href={`/admin/app/cafe/${cafeId}/categories`} className="text-primary hover:underline">
            Go to Categories
          </a>
        </div>
      ) : (
        <ProductList cafeId={cafeId} categories={categories} />
      )}
    </div>
  );
};

export default ProductsPage;
