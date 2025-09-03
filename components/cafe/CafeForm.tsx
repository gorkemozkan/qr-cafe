"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import FilePicker from "@/components/ui/file-picker";
import { CurrencySelect } from "@/components/ui/currency-select";
import { Tables } from "@/types/db";
import { CafeSchema, cafeSchema } from "@/lib/schema";
import { uploadCafeLogo } from "@/lib/supabase/storage";

interface CafeFormProps {
  mode: "create" | "edit";
  cafe?: Tables<"cafes">;
  onSubmit: (data: CafeSchema) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const CafeForm = ({ mode, cafe, onSubmit, onCancel }: CafeFormProps) => {
  //#region States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  //#endregion

  //#region Form

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CafeSchema>({
    resolver: zodResolver(cafeSchema),
    defaultValues: {
      slug: "",
      description: "",
      logo_url: "",
      currency: "TRY",
      is_active: true,
    },
  });

  const isActive = watch("is_active");

  const selectedCurrency = watch("currency");

  //#endregion

  //#region Effects

  useEffect(() => {
    if (mode === "edit" && cafe) {
      reset({
        slug: cafe.slug,
        description: cafe.description || "",
        logo_url: cafe.logo_url || "",
        currency: cafe.currency || "TRY",
        is_active: cafe.is_active,
      });
      setSelectedFile(null);
    } else {
      reset({
        slug: "",
        description: "",
        logo_url: "",
        currency: "TRY",
        is_active: true,
      });
      setSelectedFile(null);
    }
  }, [mode, cafe, reset]);

  //#endregion

  //#region Handlers

  const onSubmitForm = async (data: CafeSchema) => {
    try {
      if (selectedFile) {
        setIsUploading(true);
        setUploadError(null);

        const uploadResult = await uploadCafeLogo(selectedFile, data.slug);

        if (!uploadResult.success) {
          setUploadError(uploadResult.error.message);
          return;
        }

        data.logo_url = uploadResult.data.url;
      }

      await onSubmit(data);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setUploadError(null);
  };

  const handleFileError = (error: string) => {
    setUploadError(error);
  };

  //#endregion

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      {/* Slug Field */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input id="slug" placeholder="my-cafe" {...register("slug")} className={errors.slug ? "border-red-500" : ""} />
        {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
        <p className="text-xs text-muted-foreground">This will be used in the URL: /my-cafe</p>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Describe your cafe..." {...register("description")} rows={3} />
      </div>

      {/* Logo Upload Field */}
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
        />
        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
        {cafe?.logo_url && !selectedFile && (
          <div className="flex items-center space-x-2">
            <Image src={cafe.logo_url} alt="Current logo" width={48} height={48} className="h-12 w-12 rounded object-cover" />
            <p className="text-sm text-muted-foreground">Current logo will be replaced if you select a new file</p>
          </div>
        )}
      </div>

      {/* Currency Field */}
      <CurrencySelect id="currency" label="Currency" value={selectedCurrency} onValueChange={(value) => setValue("currency", value)} error={errors.currency?.message} />

      {/* Active Status Field */}
      <div className="flex items-center space-x-2">
        <Switch id="is_active" checked={isActive} onCheckedChange={(checked: boolean) => setValue("is_active", checked)} />
        <Label htmlFor="is_active">Active</Label>
        <p className="text-xs text-muted-foreground ml-2">{isActive ? "Cafe is active and visible" : "Cafe is inactive and hidden"}</p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || isUploading} className="min-w-[100px]">
          {isSubmitting || isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : mode === "create" ? (
            "Create Cafe"
          ) : (
            "Update Cafe"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CafeForm;
