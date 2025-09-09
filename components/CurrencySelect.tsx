"use client";

import { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SupportedCurrency = "TRY" | "USD" | "EUR";

interface CurrencySelectProps {
  id?: string;
  label?: string;
  value?: SupportedCurrency;
  onValueChange: (value: SupportedCurrency) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const CURRENCY_OPTIONS: Array<{ value: SupportedCurrency; label: string; symbol: string }> = [
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
