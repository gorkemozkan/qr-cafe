"use client";

import { Tables } from "@/types/db";
import { useParams } from "next/navigation";
import { useRequest } from "@/hooks/use-request";
import { categoryRepository } from "@/lib/repositories";
import ProductList from "@/components/product/ProductList";
import { FC, useEffect, useState, useCallback } from "react";
import ProductCreateModal from "@/components/product/ProductCreateModal";

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

  const fetchCategoriesCallback = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (cafeId) {
      fetchCategoriesCallback();
    }
  }, [cafeId, fetchCategoriesCallback]);

  if (isNaN(cafeId)) {
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
