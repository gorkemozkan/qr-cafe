"use client";

import { Plus } from "lucide-react";
import { FC, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import FormSheet from "@/components/common/FormSheet";
import SubmitButton from "@/components/common/SubmitButton";
import TooltipButton from "@/components/common/TooltipButton";
import ProductForm, { ProductFormRef } from "@/components/product/ProductForm";
import { Button } from "@/components/ui/button";
import useCafeData from "@/hooks/useCafeData";
import { useRequest } from "@/hooks/useRequest";
import QueryKeys from "@/lib/query";
import { productRepository } from "@/lib/repositories/product-repository";
import { type ProductSchema } from "@/lib/schema";

interface Props {
  cafeId: number;
  onSuccess?: () => void;
  categoryId: number;
}

const ProductCreateSheet: FC<Props> = (props) => {
  const t = useTranslations("product");

  //#region States

  const [open, setOpen] = useState(false);

  const formRef = useRef<ProductFormRef>(null);

  const { cafeSlug } = useCafeData(props.cafeId);

  //#endregion

  //#region Hooks

  const createProductMutation = useRequest({
    mutationFn: async (data: ProductSchema) => {
      return await productRepository.create(props.cafeId, data);
    },
    onSuccess: () => {
      setOpen(false);
      props.onSuccess?.();
    },
    successMessage: t("createSheet.productCreated"),
    invalidateQueries: [
      QueryKeys.productsByCafe(props.cafeId.toString()),
      QueryKeys.productsByCategory(props.categoryId.toString()),
      QueryKeys.stats,
    ],
  });

  const handleSubmit = async (data: ProductSchema) => {
    await createProductMutation.execute(data);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCreateClick = () => {
    setOpen(true);
  };

  //#endregion

  return (
    <>
      <TooltipButton onClick={handleCreateClick} tooltip={t("createSheet.tooltip")}>
        <Button size={"lg"} variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </TooltipButton>
      {open && (
        <FormSheet
          footer={
            <SubmitButton
              onClick={() => formRef.current?.submitForm()}
              disabled={createProductMutation.isLoading}
              isLoading={createProductMutation.isLoading}
              text={t("createSheet.createButton")}
              loadingText={t("createSheet.creating")}
            />
          }
          title={t("createSheet.title")}
          description={t("createSheet.description")}
          onOpenChange={setOpen}
        >
          <ProductForm
            ref={formRef}
            mode="create"
            cafeSlug={cafeSlug}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            categoryId={props.categoryId}
            isLoading={createProductMutation.isLoading}
          />
        </FormSheet>
      )}
    </>
  );
};

export default ProductCreateSheet;
