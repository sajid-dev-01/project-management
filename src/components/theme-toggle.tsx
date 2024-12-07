"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

import { Button, ButtonProps } from "./ui/button";

export const ThemeToggle = ({
  className,
  size = "icon",
  variant = "secondary",
  ...rest
}: ButtonProps) => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      size={size}
      variant={variant}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn("rounded-full", className)}
      {...rest}
    >
      <Moon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Sun className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle dark mode</span>
    </Button>
  );
};
