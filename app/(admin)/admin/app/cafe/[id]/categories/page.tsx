"use client";

import { FC } from "react";
import { useParams } from "next/navigation";
import CategoryList from "@/components/cafe/CategoryList";
import CategoryCreateModal from "@/components/cafe/CategoryCreateModal";

const CategoriesPage: FC = () => {
  const params = useParams();
  const cafeId = parseInt(params.id as string, 10);

  if (isNaN(cafeId)) {
    return <div>Invalid cafe ID</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage categories for your cafe</p>
        </div>
        <CategoryCreateModal 
          cafeId={cafeId} 
          onSuccess={() => {
            // This will trigger a refetch of the categories list
            // The DataTable will automatically refetch due to query invalidation
          }}
        />
      </div>
      <CategoryList cafeId={cafeId} />
    </div>
  );
};

export default CategoriesPage;
