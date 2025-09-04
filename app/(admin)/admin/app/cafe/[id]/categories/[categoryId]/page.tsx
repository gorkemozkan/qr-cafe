"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { categoryRepository } from "@/lib/repositories";
import { useQueryRequest } from "@/hooks/use-request";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import DateView from "@/components/ui/date-view";
import ProductList from "@/components/product/ProductList";
import ProductCreateModal from "@/components/product/ProductCreateModal";
import CategoryEditModal from "@/components/category/CategoryEditModal";
import QueryKeys from "@/constants/query-keys";
import { NextPage } from "next";

const CategoryDetailPage: NextPage = () => {
  const params = useParams();

  const router = useRouter();

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

        <ProductCreateModal cafeId={cafeId} categoryId={categoryId} />
      </div>

      <div>
        <Card className="bg-background h-max">
          <CardContent className=" grid sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-4">
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
