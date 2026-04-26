The file was corrupted — its content was a prose commit message instead of code. I've reconstructed `StatusDot` at `src/components/ui/status-dot.tsx` with:

- `cn` imported from `@takaki/go-design-system` (confirmed exported there)
- Outer `<span>` accepting an optional `className` prop
- Inner `<span>` with a single merged `className={cn("rounded-full size-1.5", statusColorMap[status])}` — matching the description of the fix that was supposed to be applied