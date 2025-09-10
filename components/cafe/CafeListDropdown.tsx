"use client";

import { FC } from "react";
import InputErrorMessage from "@/components/common/InputErrorMessage";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryRequest } from "@/hooks/useRequest";
import QueryKeys from "@/lib/query";
import { cafeRepository } from "@/lib/repositories/cafe-repository";

interface Props {
  id?: string;
  label?: string;
  value?: number;
  onValueChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  required?: boolean;
}

const CafeListDropdown: FC<Props> = (props) => {
  const { data: cafes, isLoading } = useQueryRequest({
    queryKey: QueryKeys.cafes,
    queryFn: async () => await cafeRepository.list(),
  });

  return (
    <div className="space-y-2">
      {props.label && (
        <Label htmlFor={props.id}>
          {props.label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select
        value={props.value?.toString()}
        onValueChange={(selectedValue) => props.onValueChange(Number(selectedValue))}
        disabled={props.disabled || isLoading}
      >
        <SelectTrigger id={props.id} className={`${props.error ? "border-red-500" : ""} ${props.className || ""}`}>
          <SelectValue placeholder={isLoading ? "Loading cafes..." : props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {cafes?.map((cafe) => (
            <SelectItem key={cafe.id} value={cafe.id.toString()}>
              {cafe.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <InputErrorMessage>{props.error}</InputErrorMessage>
    </div>
  );
};

export default CafeListDropdown;
