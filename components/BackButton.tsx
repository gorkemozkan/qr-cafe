"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
};

export default BackButton;
