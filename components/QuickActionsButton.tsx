"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Home,
  Coffee,
  Package,
  FolderOpen,
  User,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Globe,
  Search,
  Command,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRequest } from "@/hooks/use-request";
import { authRepository } from "@/lib/repositories";
import { useTranslations } from "next-intl";

// Helper function to set locale cookie safely
const setLocaleCookie = (locale: string) => {
  const cookieValue = encodeURIComponent(locale);
  document.cookie = `locale=${cookieValue}; path=/; max-age=31536000; samesite=lax`;
};

const QuickActionsButton = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();
  const tCommon = useTranslations("common");
  const tNavigation = useTranslations("navigation");
  const tCafe = useTranslations("cafe");
  const tProduct = useTranslations("product");
  const tCategory = useTranslations("category");

  const { execute: logout } = useRequest({
    mutationFn: () => authRepository.logout(),
    onSuccess: () => {
      window.location.href = "/admin/auth/login";
    },
    onError: () => {
      window.location.href = "/admin/auth/login";
    },
    successMessage: tCommon("loggedOutSuccessfully"),
  });

  // Handle keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const commands = [
    // Navigation
    {
      id: "dashboard",
      label: tNavigation("dashboard"),
      icon: Home,
      action: () => router.push("/admin/app/dashboard"),
      group: "navigation",
    },
    {
      id: "search",
      label: tCommon("search"),
      icon: Search,
      action: () => {
        // Focus search input if available
        const searchInput = document.querySelector(
          'input[type="search"], input[placeholder*="search" i]',
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      group: "navigation",
    },

    // Creation
    {
      id: "new-cafe",
      label: `${tCommon("new")} ${tCafe("cafe")}`,
      icon: Coffee,
      action: () => {
        // Trigger cafe creation modal/sheet
        const cafeCreateBtn = document.querySelector('[data-action="create-cafe"]') as HTMLElement;
        if (cafeCreateBtn) {
          cafeCreateBtn.click();
        } else {
          router.push("/admin/app/cafe?create=true");
        }
      },
      group: "creation",
    },
    {
      id: "new-product",
      label: `${tCommon("new")} ${tProduct("product")}`,
      icon: Package,
      action: () => {
        // Trigger product creation modal/sheet
        const productCreateBtn = document.querySelector('[data-action="create-product"]') as HTMLElement;
        if (productCreateBtn) {
          productCreateBtn.click();
        } else {
          router.push("/admin/app/dashboard?create=product");
        }
      },
      group: "creation",
    },
    {
      id: "new-category",
      label: `${tCommon("new")} ${tCategory("category")}`,
      icon: FolderOpen,
      action: () => {
        // Trigger category creation modal
        const categoryCreateBtn = document.querySelector('[data-action="create-category"]') as HTMLElement;
        if (categoryCreateBtn) {
          categoryCreateBtn.click();
        }
      },
      group: "creation",
    },

    // User Actions
    {
      id: "profile",
      label: tCommon("profile"),
      icon: User,
      action: () => {
        // Could open user profile modal or navigate to profile page
        console.log("Profile action");
      },
      group: "user",
    },
    {
      id: "logout",
      label: tCommon("logout"),
      icon: LogOut,
      action: () => logout(),
      group: "user",
    },

    // Theme
    {
      id: "theme-light",
      label: `${tCommon("theme")}: Light`,
      icon: Sun,
      action: () => setTheme("light"),
      group: "preferences",
    },
    {
      id: "theme-dark",
      label: `${tCommon("theme")}: Dark`,
      icon: Moon,
      action: () => setTheme("dark"),
      group: "preferences",
    },
    {
      id: "theme-system",
      label: `${tCommon("theme")}: System`,
      icon: Monitor,
      action: () => setTheme("system"),
      group: "preferences",
    },

    // Language
    {
      id: "language-en",
      label: `${tCommon("language")}: English`,
      icon: Globe,
      action: () => {
        setLocaleCookie("en");
        window.location.reload();
      },
      group: "preferences",
    },
    {
      id: "language-tr",
      label: `${tCommon("language")}: Türkçe`,
      icon: Globe,
      action: () => {
        setLocaleCookie("tr");
        window.location.reload();
      },
      group: "preferences",
    },
  ];

  const runCommand = (commandId: string) => {
    const command = commands.find((cmd) => cmd.id === commandId);
    if (command) {
      command.action();
      setOpen(false);
    }
  };

  // Group commands by category
  const groupedCommands = commands.reduce(
    (acc, command) => {
      if (!acc[command.group]) {
        acc[command.group] = [];
      }
      acc[command.group].push(command);
      return acc;
    },
    {} as Record<string, typeof commands>,
  );

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="rounded-lg"
        onClick={() => setOpen(true)}
        title={`${tCommon("quickActions")} (⌘K)`}
      >
        <Command className="h-4 w-4" />
        <span className="sr-only">{tCommon("quickActions")} (⌘K)</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={tCommon("searchCommands")} />
        <CommandList>
          <CommandEmpty>{tCommon("noResults")}</CommandEmpty>

          {Object.entries(groupedCommands).map(([group, groupCommands]) => (
            <div key={group}>
              <CommandGroup heading={tCommon(group)}>
                {groupCommands.map((command) => {
                  const Icon = command.icon;
                  return (
                    <CommandItem key={command.id} onSelect={() => runCommand(command.id)} className="cursor-pointer">
                      <Icon className="mr-2 h-4 w-4" />
                      {command.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default QuickActionsButton;
