import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Force dark theme for crypto design
    const initialTheme = "dark";
    setTheme(initialTheme);
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    // Keep dark theme for crypto design
    console.log("Dark theme locked for crypto design");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}