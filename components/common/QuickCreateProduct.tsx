"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import QuickProductCreateSheet from "@/components/product/QuickProductCreateSheet";
import { Button } from "@/components/ui/button";

const PageTitleWithUser = () => {
  const t = useTranslations("common");
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsQuickCreateOpen(true)}
        size="lg"
        className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full bg-orange-500 hover:bg-orange-500/90"
        aria-label={t("createProductInstantly")}
      >
        <Plus className="h-6 w-6 text-white " />
      </Button>
      <QuickProductCreateSheet open={isQuickCreateOpen} onOpenChange={setIsQuickCreateOpen} />
    </>
  );
};

export default PageTitleWithUser;
