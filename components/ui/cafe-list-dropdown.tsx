"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cafeRepository } from "@/lib/repositories/cafe-repository";
import { Tables } from "@/types/db";
import { toast } from "sonner";

interface CafeListDropdownProps {
  id?: string;
  label?: string;
  value?: number;
  onValueChange: (value: number) => void;
  onCafesLoaded?: (cafes: Tables<"cafes">[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  required?: boolean;
}

export const CafeListDropdown = ({
  id,
  label,
  value,
  onValueChange,
  onCafesLoaded,
  placeholder = "Select a cafe",
  disabled = false,
  error,
  className,
  required = false,
}: CafeListDropdownProps) => {
  const [cafes, setCafes] = useState<Tables<"cafes">[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCafes = async () => {
      setIsLoading(true);
      try {
        const cafesData = await cafeRepository.list();
        setCafes(cafesData);
        onCafesLoaded?.(cafesData);
      } catch (error) {
        console.error("Failed to load cafes:", error);
        toast.error("Failed to load cafes");
      } finally {
        setIsLoading(false);
      }
    };

    loadCafes();
  }, [onCafesLoaded]);

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select
        value={value?.toString()}
        onValueChange={(selectedValue) => onValueChange(Number(selectedValue))}
        disabled={disabled || isLoading}
      >
        <SelectTrigger id={id} className={`${error ? "border-red-500" : ""} ${className || ""}`}>
          <SelectValue placeholder={isLoading ? "Loading cafes..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {cafes.map((cafe) => (
            <SelectItem key={cafe.id} value={cafe.id.toString()}>
              {cafe.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
