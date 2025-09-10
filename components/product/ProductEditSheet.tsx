"use client";

import { FC, useRef } from "react";
import { useTranslations } from "next-intl";

import FormSheet from "@/components/common/FormSheet";
import SubmitButton from "@/components/common/SubmitButton";
import ProductForm, { ProductFormRef } from "@/components/product/ProductForm";
import useCafeData from "@/hooks/useCafeData";
import { useRequest } from "@/hooks/useRequest";
import QueryKeys from "@/lib/query";
import { productRepository } from "@/lib/repositories/product-repository";
import { type ProductSchema } from "@/lib/schema";
import { Tables } from "@/types/db";

interface Props {
  cafeId: number;
  onSuccess?: () => void;
  product: Tables<"products">;
  categoryId: number;
  onClose: () => void;
}

const ProductEditSheet: FC<Props> = (props) => {
  //#region States

  const formRef = useRef<ProductFormRef>(null);

  const { cafeSlug } = useCafeData(props.cafeId);

  const t = useTranslations("product");

  //#endregion

  //#region Hooks

  const { execute, isLoading } = useRequest({
    mutationFn: async (payload: ProductSchema) => {
      return await productRepository.update(props.product.id, payload);
    },
    onSuccess: () => {
      props.onClose();
      props.onSuccess?.();
    },
    successMessage: t("edit.successMessage"),
    invalidateQueries: [
      QueryKeys.productsByCafe(props.cafeId.toString()),
      QueryKeys.productsByCategory(props.categoryId.toString()),
      QueryKeys.stats,
    ],
  });

  const handleCancel = () => {
    props.onClose();
  };

  //#endregion

  return (
    <FormSheet
      title={t("edit.title")}
      description={t("edit.description")}
      onOpenChange={props.onClose}
      footer={
        <SubmitButton
          onClick={() => formRef.current?.submitForm()}
          disabled={isLoading}
          isLoading={isLoading}
          text={t("edit.button")}
          loadingText={t("edit.loadingButton")}
        />
      }
    >
      <ProductForm
        ref={formRef}
        mode="edit"
        cafeSlug={cafeSlug}
        product={props.product}
        categoryId={props.categoryId}
        onSubmit={async (data) => {
          await execute(data);
        }}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </FormSheet>
  );
};

export default ProductEditSheet;
