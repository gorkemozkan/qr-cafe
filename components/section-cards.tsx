import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Item {
  title: string;
  value: string;
  description: string;
}

interface Props {
  items: Item[];
}

const SectionCards = (props: Props) => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {props.items.map((item) => (
        <Card className="@container/card" key={item.title}>
          <CardHeader>
            <CardDescription>{item.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{item.value}</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 ">
            <p className="line-clamp-1 flex gap-2  text-xs  text-muted-foreground">{item.description}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SectionCards;
