"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

export function FilePicker({
  id,
  label = "Choose file",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  value,
  onChange,
  onError,
  className,
  disabled = false,
}: FilePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
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
    <div suppressHydrationWarning className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <button
        type="button"
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors w-full text-left",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        disabled={disabled}
        aria-label="File drop zone"
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: "1px", height: "1px" }}
          disabled={disabled}
        />

        {!value ? (
          <div className="text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-muted p-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Drop your file here, or <span className="text-primary underline-offset-4 hover:underline">browse</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {accept === "image/*" ? "PNG, JPG, GIF up to" : "File up to"} {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {preview && accept === "image/*" ? (
                <img src={preview} alt="Preview" className="h-12 w-12 rounded object-cover" />
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
      </button>
    </div>
  );
}
