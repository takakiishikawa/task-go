"use client";

type StatusDotVariant = "green" | "blue" | "gray";

const DOT_CLASS: Record<StatusDotVariant, string> = {
  green: "bg-success",
  blue: "bg-primary",
  gray: "bg-muted-foreground/40",
};

export function StatusDot({
  variant,
  label,
  className = "",
}: {
  variant: StatusDotVariant;
  label?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`inline-block w-2 h-2 rounded-full shrink-0 ${DOT_CLASS[variant]}`}
      />
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </span>
  );
}
