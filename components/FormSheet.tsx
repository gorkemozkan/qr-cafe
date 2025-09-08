"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Props {
  children: React.ReactNode;
  footer: React.ReactNode;
  title: string;
  description: string;
  onOpenChange: (open: boolean) => void;
}

const FormSheet: FC<Props> = (props) => {
  //#endregion

  return (
    <Sheet open onOpenChange={props.onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{props.title}</SheetTitle>
          <SheetDescription>{props.description}</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">{props.children}</div>
        <SheetFooter>
          {props.footer}
          <Button variant="outline" onClick={() => props.onOpenChange(false)}>
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FormSheet;
