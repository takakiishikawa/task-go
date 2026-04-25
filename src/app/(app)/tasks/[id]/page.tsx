Fixed both errors by merging the duplicate `className` attributes:

- Line 567: `<AlertTriangle className="text-warning" className="size-3" />` → `<AlertTriangle className="text-warning size-3" />`
- Line 592: `<Sparkles className="text-primary" className="size-3" />` → `<Sparkles className="text-primary size-3" />`