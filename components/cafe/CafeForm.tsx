"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { CurrencySelect } from "@/components/common/CurrencySelect";
import InputErrorMessage from "@/components/common/InputErrorMessage";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import FilePicker from "@/components/ui/file-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CafeSchema, cafeSchema } from "@/lib/schema";
import { uploadCafeLogo } from "@/lib/supabase/storage";
import { Tables } from "@/types/db";

export interface CafeFormRef {
  submitForm: () => void;
  cancelForm: () => void;
}

interface Props {
  mode: "create" | "edit";
  cafe?: Tables<"cafes">;
  onSubmit: (data: CafeSchema, logoFile?: File) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const CafeForm = forwardRef<CafeFormRef, Props>((props, ref) => {
  //#region States

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  //#endregion

  const getDefaultValues = (): CafeSchema => {
    if (props.mode === "edit" && props.cafe) {
      return {
        name: props.cafe.name || props.cafe.slug,
        description: props.cafe.description || "",
        logo_url: props.cafe.logo_url || "",
        currency: props.cafe.currency as "TRY" | "USD" | "EUR",
        is_active: props.cafe.is_active,
      };
    }

    return {
      name: "",
      description: "",
      logo_url: "",
      currency: "TRY",
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

  //#region Methods

  const isActive = watch("is_active");

  const selectedCurrency = watch("currency");

  //#endregion

  //#region Methods

  // Expose form methods via ref
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(onSubmitForm)();
    },
    cancelForm: () => {
      props.onCancel?.();
    },
  }));

  const onSubmitForm = async (data: CafeSchema) => {
    setSubmitError(null);

    try {
      if (props.mode === "create") {
        await props.onSubmit(data, selectedFile || undefined);
      } else {
        if (selectedFile) {
          setIsUploading(true);

          setUploadError(null);

          const slug = props.cafe?.slug || `temp-${Date.now()}`;
          const uploadResult = await uploadCafeLogo(selectedFile, slug);

          if (!uploadResult.success) {
            const errorMessage = `Upload failed: ${uploadResult.error.message}`;
            setUploadError(errorMessage);
            return;
          }

          data.logo_url = uploadResult.data.url;
        }

        await props.onSubmit(data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Operation failed";
      setSubmitError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setUploadError(null);
    setSubmitError(null);
  };

  const handleFileError = (error: string) => {
    setUploadError(error);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Cafe Name *</Label>
        <Input
          id="name"
          placeholder="Enter your cafe's name"
          {...register("name")}
          className={errors.name || submitError ? "border-red-500" : ""}
          onChange={(e) => {
            register("name").onChange(e);
            setSubmitError(null);
          }}
        />
        <InputErrorMessage id="name-error">{errors.name?.message}</InputErrorMessage>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Describe your cafe..." {...register("description")} rows={3} />
        <InputErrorMessage id="description-error">{errors.description?.message}</InputErrorMessage>
      </div>
      <div className="space-y-2">
        <FilePicker
          id="logo"
          label="Cafe Logo"
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
          value={selectedFile}
          onChange={handleFileChange}
          onError={handleFileError}
          disabled={isUploading}
          loading={isUploading}
        />
        {uploadError && <InputErrorMessage id="upload-error">{uploadError}</InputErrorMessage>}
        {props.cafe?.logo_url && !selectedFile && (
          <div className="flex items-center space-x-2">
            <OptimizedImage
              src={props.cafe.logo_url}
              alt="Current logo"
              width={48}
              height={48}
              className="h-12 w-12 rounded object-cover"
              fallbackSrc="/placeholder-logo.svg"
              showSkeleton={false}
            />
            <p className="text-sm text-muted-foreground">Current logo will be replaced if you select a new file</p>
          </div>
        )}
      </div>
      <CurrencySelect
        id="currency"
        label="Currency"
        value={selectedCurrency}
        onValueChange={(value) => setValue("currency", value)}
        error={errors.currency?.message}
      />
      <div className="flex items-center space-x-2">
        <Switch id="is_active" checked={isActive} onCheckedChange={(checked: boolean) => setValue("is_active", checked)} />
        <Label htmlFor="is_active">{watch("is_active") ? "Active" : "Inactive"}</Label>
        <p className="text-xs text-muted-foreground ml-2">{isActive ? "Cafe is active and visible" : "Cafe is inactive and hidden"}</p>
      </div>
      {submitError && <InputErrorMessage id="submit-error">{submitError}</InputErrorMessage>}
    </form>
  );
});

export default CafeForm;
