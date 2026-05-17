import * as React from "react"
import { cn } from "@/lib/utils"

interface InfoBoxProps {
  children: React.ReactNode
  className?: string
}

const InfoBox = React.forwardRef<HTMLDivElement, InfoBoxProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-border bg-muted px-5 py-4 [font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed",
          className
        )}
      >
        {children}
      </div>
    )
  }
)
InfoBox.displayName = "InfoBox"

export { InfoBox }
