import { FC, useEffect, useState } from "react";
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Item {
  title: string;
  value: string;
  percentage?: string;
  description: string;
}

interface Props {
  items: Item[];
}

const SectionCards: FC<Props> = (props) => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      props.items.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => new Set([...prev, index]));
        }, index * 150); // 150ms delay between each card
      });
    }, 100); // Initial delay before starting animation

    return () => clearTimeout(timer);
  }, [props.items]);

  return (
    <div className="grid grid-cols-1 gap-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 relative">
      {props.items.map((item, index) => (
        <Card
          key={item.title}
          className={cn(
            "@container/card relative overflow-hidden",
            "bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm",
            "border border-border/50 shadow-lg shadow-black/5",
            "hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20",
            "transition-all duration-500 ease-out",
            "hover:-translate-y-1 hover:scale-[1.02]",
            "group p-0",
            // Animation classes
            visibleCards.has(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <CardHeader className="relative p-4 pb-2">
            <CardDescription className="text-sm font-medium text-muted-foreground/80 group-hover:text-muted-foreground transition-colors">
              {item.title}
            </CardDescription>
            <div className="mt-3">
              <p className="text-3xl font-black tabular-nums @[250px]/card:text-3xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {item.value}
              </p>
            </div>
          </CardHeader>

          <CardFooter className="relative flex-col items-start gap-2 p-4 pt-0">
            <p className="line-clamp-2 text-xs text-muted-foreground/70 group-hover:text-muted-foreground/90 transition-colors leading-relaxed">
              {item.description}
            </p>

            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SectionCards;
