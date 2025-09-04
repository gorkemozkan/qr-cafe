"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
}: OptimizedImageProps) {
  // Check if src is valid (not empty string, null, or undefined)
  const isValidSrc = src && src.trim().length > 0;
  const initialSrc = isValidSrc ? src : fallbackSrc;

  const [isLoading, setIsLoading] = useState(!!initialSrc);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

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

  const imageClasses = cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", className);

  // If no valid src is provided and no fallback, render fallback UI
  if (!currentSrc || currentSrc.trim().length === 0) {
    return (
      <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)} style={{ width: width || 100, height: height || 100 }}>
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  if (hasError && !fallbackSrc) {
    return (
      <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)} style={{ width: width || 100, height: height || 100 }}>
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {showSkeleton && isLoading && <Skeleton className={cn("absolute inset-0", className)} style={{ width: width || 100, height: height || 100 }} />}

      <Image
        src={currentSrc} // We've already validated currentSrc is not empty
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
      />
    </div>
  );
}

export default OptimizedImage;
