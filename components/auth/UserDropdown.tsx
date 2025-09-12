"use client";

import { LogOut, Shield, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRequest } from "@/hooks/useRequest";
import { authRepository } from "@/lib/repositories/auth-repository";

const UserDropdown = () => {
  const t = useTranslations("auth.userMenu");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { isLoading: logoutLoading, execute: logout } = useRequest({
    mutationFn: () => authRepository.logout(),
    onSuccess: () => {
      window.location.href = "/admin/auth/login";
    },
    onError: () => {
      window.location.href = "/admin/auth/login";
    },
    successMessage: t("logoutSuccess"),
  });

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button size={"lg"} variant="outline" className="rounded-lg">
          <User className="h-4 w-4" />
          <span className="sr-only">{t("userMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/admin/app/gdpr">
            <Shield className="mr-2 h-4 w-4" />
            {t("settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} disabled={logoutLoading} variant="destructive" className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          {logoutLoading ? t("loggingOut") : t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
