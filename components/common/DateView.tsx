"use client";

import { format as formatDate, formatDistance, isValid } from "date-fns";
import { enUS } from "date-fns/locale";
import { tr } from "date-fns/locale";
import { de } from "date-fns/locale";
import { FC } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface DateViewProps {
  date: string | Date | number;
  format?: "short" | "long" | "relative" | "time" | "datetime" | "detailed";
  className?: string;
  showTime?: boolean;
}

const DateView: FC<DateViewProps> = ({ date, format = "short", className, showTime = false }) => {
  const t = useTranslations("common");
  const locale = useLocale();

  const dateObj = new Date(date);

  if (!isValid(dateObj)) {
    return <span className={cn("inline-block", className)}>{t("invalidDate")}</span>;
  }

  const getDateLocale = () => {
    switch (locale) {
      case "tr":
        return tr;
      case "en":
        return enUS;
    }
  };

  const dateLocale = getDateLocale();

  const getFormattedDate = () => {
    switch (format) {
      case "short":
        return formatDate(dateObj, "P", { locale: dateLocale });
      case "long":
        return formatDate(dateObj, "PPPP", { locale: dateLocale });
      case "relative":
        return formatDistance(dateObj, new Date(), { addSuffix: true, locale: dateLocale });
      case "time":
        return formatDate(dateObj, "p", { locale: dateLocale });
      case "datetime":
        return formatDate(dateObj, "Pp", { locale: dateLocale });
      case "detailed":
        return formatDate(dateObj, "PPPP 'at' p", { locale: dateLocale });
      default:
        return formatDate(dateObj, "P", { locale: dateLocale });
    }
  };

  const getTimeString = () => {
    if (!showTime || format === "time" || format === "datetime" || format === "detailed") {
      return "";
    }
    return formatDate(dateObj, "p", { locale: dateLocale });
  };

  return (
    <time dateTime={dateObj.toISOString()} className={cn("inline-block", className)}>
      {getFormattedDate()}
      {getTimeString() && <span className="ml-2 text-muted-foreground">{getTimeString()}</span>}
    </time>
  );
};

export default DateView;
