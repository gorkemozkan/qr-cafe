"use client";

import { useState } from "react";

import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { useRequest } from "@/hooks/use-request";
import { authRepository } from "@/lib/repositories";
import { useTranslations } from "next-intl";

const UserDropdown = () => {
  const tCommon = useTranslations("common");
  const { user, isLoading: userLoading } = useUser();
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

  if (userLoading) {
    return (
      <Button variant="outline" size="icon" disabled>
        <User className="h-4 w-4" />
      </Button>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <User className="h-4 w-4" />
          <span className="sr-only">{tCommon("userMen u")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{tCommon("account")}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={logoutLoading}
          variant="destructive"
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutLoading ? tCommon("loggingOut") : tCommon("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
