"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import FilePicker from "@/components/ui/file-picker";
import { CurrencySelect } from "@/components/ui/currency-select";
import { OptimizedImage } from "@/components/ui";
import { Tables } from "@/types/db";
import { CafeSchema, cafeSchema } from "@/lib/schema";
import { uploadCafeLogo } from "@/lib/supabase/storage";

interface Props {
  mode: "create" | "edit";
  cafe?: Tables<"cafes">;
  onSubmit: (data: CafeSchema, logoFile?: File) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const CafeForm: FC<Props> = (props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const getDefaultValues = (): CafeSchema => {
    if (props.mode === "edit" && props.cafe) {
      return {
        name: props.cafe.name || props.cafe.slug, // Fallback to slug if name doesn't exist yet
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
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CafeSchema>({
    resolver: zodResolver(cafeSchema),
    defaultValues: getDefaultValues(),
  });

  const isActive = watch("is_active");
  const selectedCurrency = watch("currency");

  const onSubmitForm = async (data: CafeSchema) => {
    try {
      if (props.mode === "create") {
        await props.onSubmit(data, selectedFile || undefined);
      } else {
        if (selectedFile) {
          setIsUploading(true);
          setUploadError(null);

          const uploadResult = await uploadCafeLogo(selectedFile, `temp-${Date.now()}`);

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
      setUploadError(errorMessage);
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

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Cafe Name *</Label>
        <Input id="name" placeholder="Enter your cafe's name" {...register("name")} className={errors.name ? "border-red-500" : ""} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        <p className="text-xs text-muted-foreground">URL slug will be automatically generated from the cafe name</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Describe your cafe..." {...register("description")} rows={3} />
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
        />
        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
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
      <CurrencySelect id="currency" label="Currency" value={selectedCurrency} onValueChange={(value) => setValue("currency", value)} error={errors.currency?.message} />
      <div className="flex items-center space-x-2">
        <Switch id="is_active" checked={isActive} onCheckedChange={(checked: boolean) => setValue("is_active", checked)} />
        <Label htmlFor="is_active">{watch("is_active") ? "Active" : "Inactive"}</Label>
        <p className="text-xs text-muted-foreground ml-2">{isActive ? "Cafe is active and visible" : "Cafe is inactive and hidden"}</p>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        {props.onCancel && (
          <Button type="button" variant="outline" onClick={props.onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || isUploading} className="min-w-[100px]">
          {isSubmitting || isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {props.mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : props.mode === "create" ? (
            "Create"
          ) : (
            "Update"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CafeForm;
