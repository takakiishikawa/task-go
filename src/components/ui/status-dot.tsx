interface StatusDotProps {
  variant: "green" | "blue" | "gray";
  label?: string;
  className?: string;
}

const COLOR_MAP: Record<StatusDotProps["variant"], string> = {
  green: "bg-success",
  blue: "bg-[color:var(--color-primary)]",
  gray: "bg-muted-foreground/50",
};

export function StatusDot({ variant, label, className }: StatusDotProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${COLOR_MAP[variant]}`} />
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
}
