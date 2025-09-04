import { FC } from "react";
import { cn } from "@/lib/utils";

interface DateViewProps {
  date: string | Date | number;
  format?: "short" | "long" | "relative" | "time" | "datetime" | "detailed";
  className?: string;
  showTime?: boolean;
  timezone?: string;
}

const DateView: FC<DateViewProps> = ({ date, format = "short", className, showTime = false }) => {
  const formatDate = (dateValue: string | Date | number) => {
    const dateObj = new Date(dateValue);

    if (Number.isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    switch (format) {
      case "short":
        return dateObj.toLocaleDateString();

      case "long":
        return dateObj.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

      case "relative":
        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays === -1) return "Tomorrow";
        if (diffInDays > 0 && diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 0 && diffInDays > -7) return `In ${Math.abs(diffInDays)} days`;
        return dateObj.toLocaleDateString();

      case "time":
        return dateObj.toLocaleTimeString();

      case "datetime":
        return dateObj.toLocaleString();

      case "detailed": {
        const day = dateObj.getDate();
        const month = dateObj.toLocaleDateString(undefined, { month: "long" });
        const weekday = dateObj.toLocaleDateString(undefined, { weekday: "long" });
        const time = dateObj.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        return `${day} ${month} ${weekday} ${time}`;
      }

      default:
        return dateObj.toLocaleDateString();
    }
  };

  const formatTime = (dateValue: string | Date | number) => {
    const dateObj = new Date(dateValue);

    if (Number.isNaN(dateObj.getTime())) {
      return "";
    }

    return dateObj.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const dateString = formatDate(date);
  const timeString = showTime ? formatTime(date) : "";

  return (
    <time dateTime={new Date(date).toISOString()} className={cn("inline-block", className)}>
      {dateString}
      {showTime && timeString && <span className="ml-2 text-muted-foreground">{timeString}</span>}
    </time>
  );
};

export default DateView;
