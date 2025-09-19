"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Tables, Enums } from "@/types/db";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CafeSchema, cafeSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FilePicker from "@/components/ui/file-picker";
import { uploadCafeLogo } from "@/lib/supabase/storage";
import { forwardRef, useImperativeHandle, useState } from "react";
import { CurrencySelect } from "@/components/common/CurrencySelect";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import InputErrorMessage from "@/components/common/InputErrorMessage";

export interface CafeFormRef {
  submitForm: () => void;
  cancelForm: () => void;
}

interface Props {
  isLoading?: boolean;
  onCancel?: () => void;
  cafe?: Tables<"cafes">;
  onSubmit: (data: CafeSchema, logoFile?: File) => Promise<void>;
}

enum Status {
  IS_UPLOADING = "IS_UPLOADING",
  IS_NOT_UPLOADED = "IS_NOT_UPLOADED",
  IS_SUBMIT_ERROR = "IS_SUBMIT_ERROR",
  IS_UPLOAD_ERROR = "IS_UPLOAD_ERROR",
}

const DEFAULT_CURRENCY = "TRY" as Enums<"currency_type">;

const CafeForm = forwardRef<CafeFormRef, Props>((props, ref) => {
  //#region Hooks

  const t = useTranslations("cafe.form");

  const isEdit = !!props.cafe;

  //#endregion

  //#region States

  const [selectedFile, setSelectedFile] = useState<File | null>();

  const [status, setStatus] = useState<Status>(Status.IS_NOT_UPLOADED);

  //#endregion

  const getDefaultValues = (): CafeSchema => {
    if (props.cafe) {
      return {
        is_active: props.cafe.is_active,
        name: props.cafe.name,
        logo_url: props.cafe.logo_url || "",
        description: props.cafe.description || "",
        currency: props.cafe.currency || DEFAULT_CURRENCY,
      };
    }

    return {
      name: "",
      description: "",
      logo_url: "",
      currency: DEFAULT_CURRENCY,
      is_active: true,
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CafeSchema>({
    resolver: zodResolver(cafeSchema),
    defaultValues: getDefaultValues(),
  });

  //#endregion

  //#region Computed Values

  const isActive = watch("is_active");

  const selectedCurrency = watch("currency");

  //#endregion

  //#region Methods

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(onSubmitForm)();
    },
    cancelForm: () => {
      props.onCancel?.();
    },
  }));

  const onSubmitForm = async (data: CafeSchema) => {
    try {
      if (isEdit) {
        await props.onSubmit(data, selectedFile ? selectedFile : undefined);
      } else {
        if (selectedFile) {
          setStatus(Status.IS_UPLOADING);

          const slug = props.cafe?.slug || `temp-${Date.now()}`;

          const uploadResult = await uploadCafeLogo(selectedFile, slug);

          if (!uploadResult.success) {
            setStatus(Status.IS_UPLOAD_ERROR);
            return;
          }

          data.logo_url = uploadResult.data.url;
        }

        await props.onSubmit(data);
      }
    } catch (_error) {
      setStatus(Status.IS_SUBMIT_ERROR);
    } finally {
      setStatus(Status.IS_NOT_UPLOADED);
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setStatus(Status.IS_NOT_UPLOADED);
  };

  const handleFileError = (_error: string) => {
    setStatus(Status.IS_UPLOAD_ERROR);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")} *</Label>
        <Input
          id="name"
          placeholder={t("namePlaceholder")}
          {...register("name")}
          className={errors.name || status === Status.IS_SUBMIT_ERROR ? "border-red-500" : ""}
          onChange={(e) => {
            register("name").onChange(e);
            setStatus(Status.IS_NOT_UPLOADED);
          }}
        />
        <InputErrorMessage id="name-error">{errors.name?.message}</InputErrorMessage>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">{t("description")}</Label>
        <Textarea id="description" placeholder={t("descriptionPlaceholder")} {...register("description")} rows={3} />
        <InputErrorMessage id="description-error">{errors.description?.message}</InputErrorMessage>
      </div>
      <div className="space-y-2">
        <FilePicker
          id="logo"
          label={t("logo")}
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
          value={selectedFile}
          onChange={handleFileChange}
          onError={handleFileError}
          disabled={status === Status.IS_UPLOADING}
          loading={status === Status.IS_UPLOADING}
        />
        {status === Status.IS_UPLOAD_ERROR && <InputErrorMessage id="upload-error">{t("uploadFailed")}</InputErrorMessage>}
        {props.cafe?.logo_url && !selectedFile && (
          <div className="flex items-center space-x-2">
            <OptimizedImage
              src={props.cafe.logo_url}
              alt={t("logo")}
              width={48}
              height={48}
              className="rounded"
              fallbackSrc="/placeholder-logo.svg"
              showSkeleton={false}
            />
            <p className="text-sm text-muted-foreground">{t("currentLogoText")}</p>
          </div>
        )}
      </div>
      <CurrencySelect
        id="currency"
        label={t("currency")}
        value={selectedCurrency}
        error={errors.currency?.message}
        onValueChange={(value) => setValue("currency", value)}
      />
      <div className="flex items-center space-x-2">
        <Switch id="is_active" checked={isActive} onCheckedChange={(checked: boolean) => setValue("is_active", checked)} />
        <Label htmlFor="is_active">{watch("is_active") ? t("isActive") : t("isInactive")}</Label>
        <p className="text-xs text-muted-foreground ml-2">{isActive ? t("activeDescription") : t("inactiveDescription")}</p>
      </div>
      {status === Status.IS_SUBMIT_ERROR && <InputErrorMessage id="submit-error">{t("uploadFailed")}</InputErrorMessage>}
    </form>
  );
});

export default CafeForm;
