"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const themes = [
  { value: "system", icon: Monitor, label: "System theme" },
  { value: "light", icon: Sun, label: "Light theme" },
  { value: "dark", icon: Moon, label: "Dark theme" },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">Theme</span>
      <ToggleGroup
        type="single"
        value={theme}
        onValueChange={(value) => value && setTheme(value)}
      >
        {themes.map(({ value, icon: Icon, label }) => (
          <ToggleGroupItem key={value} value={value} aria-label={label}>
            <Icon className="h-4 w-4" />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
