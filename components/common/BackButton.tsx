"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  href?: string;
  noText?: boolean;
}

const BackButton: FC<Props> = (props) => {
  const router = useRouter();

  if (props.href) {
    return (
      <Button asChild size={"lg"} variant="outline" className="w-max mb-4">
        <Link href={props.href}>
          <ArrowLeft className="h-4 w-4" />
          {props.noText ? "" : "Back"}
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild type="button" size={"lg"} variant="outline" onClick={() => router.back()} className="w-max mb-4">
      <div>
        <ArrowLeft className="h-4 w-4" />
        {props.noText ? "" : "Back"}
      </div>
    </Button>
  );
};

export default BackButton;
