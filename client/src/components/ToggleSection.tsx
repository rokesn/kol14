import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ToggleSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export default function ToggleSection({
  title,
  description,
  children,
  defaultEnabled = false,
  onToggle,
}: ToggleSectionProps) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [expanded, setExpanded] = useState(defaultEnabled);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    setExpanded(checked);
    onToggle?.(checked);
    console.log(`${title} section ${checked ? 'enabled' : 'disabled'}`);
  };

  return (
    <Card className="crypto-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-accent rounded-sm"
              data-testid={`button-expand-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <div>
              <Label className="text-sm font-medium cursor-pointer">
                {title}
              </Label>
              {description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            data-testid={`switch-${title.toLowerCase().replace(/\s+/g, '-')}`}
          />
        </div>
      </CardHeader>
      {expanded && enabled && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );
}