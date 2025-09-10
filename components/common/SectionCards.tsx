import { FC, useEffect, useRef, useState } from "react";
import FancyBackground from "@/components/landing/FancyBackground";
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";

interface Item {
  title: string;
  value: string;
  percentage?: string;
  description: string;
}

interface Props {
  items: Item[];
}

const AnimatedValue: FC<{ value: string; className: string }> = ({ value, className }) => {
  const [displayValue, setDisplayValue] = useState(value);

  const [isAnimating, setIsAnimating] = useState(false);

  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 150);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div className="relative overflow-hidden">
      <div className={`${className} transition-all duration-300 ${isAnimating ? "scale-110 text-primary" : "scale-100"}`}>{displayValue}</div>
      {isAnimating && <div className="absolute inset-0 rounded animate-pulse" />}
    </div>
  );
};

const SectionCards: FC<Props> = (props) => {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 relative">
      <FancyBackground />
      {props.items.map((item) => (
        <Card key={item.title} className="@container/card shadow-none bg-transparent p-3">
          <CardHeader className="p-0">
            <CardDescription>{item.title}</CardDescription>
            <AnimatedValue value={item.value} className="text-3xl font-black tabular-nums @[250px]/card:text-3xl mt-3" />
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 p-0">
            <p className="line-clamp-1 flex gap-2 text-xs text-muted-foreground">{item.description}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SectionCards;
