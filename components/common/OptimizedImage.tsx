"use client";

import Image from "next/image";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  showSkeleton?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  clickable?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc,
  showSkeleton = true,
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  objectFit = "cover",
  clickable = false,
}: OptimizedImageProps) {
  const isValidSrc = src && src.trim().length > 0;

  const initialSrc = isValidSrc ? src : fallbackSrc;

  const [isLoading, setIsLoading] = useState(!!initialSrc);

  const [hasError, setHasError] = useState(false);

  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    if (clickable && currentSrc) {
      setIsPreviewOpen(true);
    }
  };

  const imageClasses = cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", clickable && "cursor-pointer", className);

  // If no valid src is provided and no fallback, render fallback UI
  if (!currentSrc || currentSrc.trim().length === 0) {
    return (
      <div
        className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}
        style={{ width: width || 100, height: height || 100 }}
      >
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  if (hasError && !fallbackSrc) {
    return (
      <div
        className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}
        style={{ width: width || 100, height: height || 100 }}
      >
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  const imageElement = (
    <div className="relative">
      {showSkeleton && isLoading && (
        <Skeleton className={cn("absolute inset-0", className)} style={fill ? undefined : { width: width || 100, height: height || 100 }} />
      )}

      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={imageClasses}
        priority={priority}
        quality={quality}
        sizes={sizes}
        fill={fill}
        style={fill ? undefined : { objectFit }}
        onLoad={handleLoad}
        onError={handleError}
        onClick={clickable ? handleImageClick : undefined}
      />
    </div>
  );

  return (
    <>
      {imageElement}

      <Drawer open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DrawerContent className="max-w-none w-full h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{alt}</DrawerTitle>
          </DrawerHeader>
          <div className="flex items-center justify-center p-4">
            <Image
              src={currentSrc}
              alt={alt}
              width={300}
              height={300}
              className="max-w-full max-h-full object-contain rounded-lg"
              priority={true}
              quality={100}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default OptimizedImage;
