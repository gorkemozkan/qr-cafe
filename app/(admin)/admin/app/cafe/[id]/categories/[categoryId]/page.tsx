"use client";

import { FC, useState } from "react";
import { useParams } from "next/navigation";

import { categoryRepository } from "@/lib/repositories";
import { useQueryRequest } from "@/hooks/use-request";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import DateView from "@/components/ui/date-view";
import ProductList from "@/components/product/ProductList";
import ProductCreateModal from "@/components/product/ProductCreateModal";
import CategoryEditModal from "@/components/cafe/CategoryEditModal";
import QueryKeys from "@/constants/query-keys";

const CategoryDetailPage: FC = () => {
  const params = useParams();
  const router = useRouter();
  const cafeId = parseInt(params.id as string, 10);
  const categoryId = parseInt(params.categoryId as string, 10);

  const [showEditModal, setShowEditModal] = useState(false);

  const {
    data: category,
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
    error: categoryError,
  } = useQueryRequest({
    queryKey: QueryKeys.category(categoryId.toString()),
    queryFn: async () => {
      return await categoryRepository.getById(categoryId);
    },
  });

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQueryRequest({
    queryKey: ["categories", cafeId.toString()],
    queryFn: async () => {
      return await categoryRepository.listByCafe(cafeId);
    },
  });

  if (Number.isNaN(cafeId) || Number.isNaN(categoryId)) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>Invalid cafe or category ID</span>
        </div>
      </div>
    );
  }

  if (isLoadingCategory || isLoadingCategories) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isErrorCategory) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <div>
            <span>Error loading category</span>
            {categoryError && (
              <div className="text-sm mt-1">
                <details className="cursor-pointer">
                  <summary className="text-xs">Error details</summary>
                  <pre className="text-xs mt-2 bg-muted p-2 rounded overflow-auto">{JSON.stringify(categoryError, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isErrorCategories) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>Error loading categories</span>
        </div>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-muted-foreground">Category details and products</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ProductCreateModal
            cafeId={cafeId}
            categories={categories || []}
            onSuccess={() => {
              // Products will be refreshed automatically
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
            <CardDescription>Basic details about this category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 grid grid-cols-5 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <p className="text-lg font-semibold">{category.name}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Description</div>
              <p className="text-sm">{category.description}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <div className="mt-1">
                <Badge variant={category.is_active ? "default" : "secondary"}>{category.is_active ? "Active" : "Inactive"}</Badge>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Sort Order</div>
              <p className="text-sm">{category.sort_order || "Not set"}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Created</div>
              <p className="text-sm">
                <DateView date={category.created_at} format="long" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Products in this category</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductList cafeId={cafeId} categoryId={categoryId} categories={categories || []} />
        </CardContent>
      </Card>

      {showEditModal && (
        <CategoryEditModal
          category={category}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            // The query will automatically refetch due to invalidation
          }}
        />
      )}
    </div>
  );
};

export default CategoryDetailPage;
