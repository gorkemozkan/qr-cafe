"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface FilePickerProps {
  id?: string;
  label?: string;
  accept?: string;
  maxSize?: number; // in bytes
  value?: File | null;
  onChange?: (file: File | null) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const FilePicker = ({
  id,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  value,
  onChange,
  onError,
  className,
  disabled = false,
  loading = false,
}: FilePickerProps) => {
  const label = "Choose file";

  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFile = (file: File) => {
    if (file.size > maxSize) {
      onError?.(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    // Check if file type matches the accept pattern
    const isImageFile = file.type.startsWith("image/");
    const isAcceptedType = accept === "image/*" ? isImageFile : file.type.match(accept.replace("*", ".*"));

    if (!isAcceptedType) {
      onError?.(`File type not supported. Please select a ${accept} file.`);
      return;
    }

    onChange?.(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      handleFile(files[0]);
    }
  };

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}

      {/** biome-ignore lint/a11y/noStaticElementInteractions: File picker needs to be clickable */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors w-full text-left cursor-pointer hover:border-muted-foreground/50",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        )}
        onClick={disabled ? undefined : handleClick}
        onKeyDown={
          disabled
            ? undefined
            : (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick();
                }
              }
        }
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: "1px", height: "1px" }}
          disabled={disabled || loading}
        />

        {!value ? (
          <div className="text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-muted p-3">
                {loading ? <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Click to browse files</p>
                <p className="text-xs text-muted-foreground">
                  {accept === "image/*" ? "PNG, JPG, GIF " : "File up to "} {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {preview && accept === "image/*" ? (
                <Image width={48} height={48} src={preview} alt="Preview" className="h-12 w-12 rounded object-cover" />
              ) : (
                <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{value.name}</p>
                <p className="text-xs text-muted-foreground">{(value.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={handleRemove} disabled={disabled} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePicker;
