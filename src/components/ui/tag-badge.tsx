import { X } from "lucide-react";

interface TagBadgeProps {
  name: string;
  size?: "xs" | "sm" | "md";
  onRemove?: () => void;
}

export function TagBadge({ name, onRemove }: TagBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
      {name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:text-foreground transition-colors"
        >
          <X className="size-2.5" />
        </button>
      )}
    </span>
  );
}
