"use client";

import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  href?: string;
}

const BackButton: FC<Props> = (props) => {
  const router = useRouter();

  if (props.href) {
    return (
      <Button asChild variant="outline" className="w-max mb-4">
        <Link href={props.href}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild type="button" size="sm" variant="outline" onClick={() => router.back()} className="w-max mb-4">
      <div>
        <ArrowLeft className="h-4 w-4" />
        Back
      </div>
    </Button>
  );
};

export default BackButton;
