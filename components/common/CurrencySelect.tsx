"use client";

import { forwardRef } from "react";
import { Enums } from "@/types/db";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CurrencySelectProps {
  id?: string;
  label?: string;
  value?: Enums<"currency_type">;
  onValueChange: (value: Enums<"currency_type">) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const CURRENCY_OPTIONS: Array<{ value: Enums<"currency_type">; label: string; symbol: string }> = [
  { value: "TRY", label: "Turkish Lira", symbol: "₺" },
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "EUR", label: "Euro", symbol: "€" },
];

export const CurrencySelect = forwardRef<HTMLButtonElement, CurrencySelectProps>(
  ({ id, label, value, onValueChange, placeholder = "Select a currency", disabled = false, error, className }, ref) => {
    return (
      <div className="space-y-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger id={id} ref={ref} className={`${error ? "border-red-500" : ""} ${className || ""}`}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_OPTIONS.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.symbol} {currency.value} - {currency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

CurrencySelect.displayName = "CurrencySelect";
