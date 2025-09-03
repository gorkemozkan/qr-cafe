import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Item {
  title: string;
  value: string;
  percentage?: string;
  description: string;
}

interface Props {
  items: Item[];
}

const SectionCards = ({ items }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title} className="@container/card">
          <CardHeader>
            <CardDescription>{item.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{item.value}</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5">
            <p className="line-clamp-1 flex gap-2 text-xs text-muted-foreground">{item.description}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SectionCards;
