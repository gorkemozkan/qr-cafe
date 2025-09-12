"use client";

import Link from "next/link";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { sendGTMEvent } from "@next/third-parties/google";

const Header: FC = () => {
  return (
    <Button asChild size="lg" variant="outline" className="font-semibold" onClick={() => sendGTMEvent({ event: "buttonClicked", value: "xyz" })}>
      <Link href="/admin/auth/login" className="hidden md:inline-flex" target="_blank">
        Sign In
      </Link>
    </Button>
  );
};

export default Header;
