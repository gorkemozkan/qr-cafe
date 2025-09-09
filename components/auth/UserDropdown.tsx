"use client";

import { useState } from "react";

import { User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useRequest } from "@/hooks/useRequest";
import { authRepository } from "@/lib/repositories";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UserDropdown = () => {
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { isLoading: logoutLoading, execute: logout } = useRequest({
    mutationFn: () => authRepository.logout(),
    onSuccess: () => {
      window.location.href = "/admin/auth/login";
    },
    onError: () => {
      window.location.href = "/admin/auth/login";
    },
    successMessage: tCommon("loggedOutSuccessfully"),
  });

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-lg">
          <User className="h-4 w-4" />
          <span className="sr-only">{tCommon("userMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/admin/app/gdpr">
            <Shield className="mr-2 h-4 w-4" />
            {tCommon("settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} disabled={logoutLoading} variant="destructive" className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          {logoutLoading ? tCommon("loggingOut") : tCommon("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
