"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ThemeToggle = () => {
  //#region Hooks

  const { setTheme, themes } = useTheme();

  //#endregion

  const getThemeText = (t: string) => {
    if (t === "light") return "Light";
    if (t === "dark") return "Dark";
    return "System";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"lg"} variant="outline" className="rounded-lg">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
            {getThemeText(theme)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
