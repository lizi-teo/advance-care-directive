"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const RadioCardGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-4", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioCardGroup.displayName = "RadioCardGroup"

const radioCardVariants = cva(
  "group relative flex cursor-pointer rounded-2xl border border-outline-border bg-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-primary hover:bg-outline-hover data-[state=checked]:border-primary data-[state=checked]:bg-outline-hover disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        small: "gap-5 p-5",
        large: "gap-6 p-8",
      },
      layout: {
        stacked: "items-start",
        inline: "items-center",
      },
    },
    defaultVariants: {
      size: "small",
      layout: "stacked",
    },
  }
)

interface RadioCardProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioCardVariants> {
  title?: string
  description?: string
  icon?: React.ReactNode
}

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioCardProps
>(({ className, children, title, description, icon, size = "small", layout, ...props }, ref) => {
  const hasContent = title || description || children
  const effectiveLayout = layout || (hasContent && (title || description) ? "stacked" : "inline")

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioCardVariants({ size, layout: effectiveLayout }), className)}
      {...props}
    >
      <div className="flex h-6 shrink-0 items-center">
        <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-outline-border transition-colors group-hover:border-primary group-data-[state=checked]:border-primary">
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            <div className="h-[10px] w-[10px] rounded-full bg-primary" />
          </RadioGroupPrimitive.Indicator>
        </div>
      </div>

      <div className={cn(
        "flex-1 text-outline-foreground text-left",
        hasContent && (title || description) ? "space-y-1" : ""
      )}>
        {icon && <div className="mb-2">{icon}</div>}
        {title && (
          <p className={cn(
            "font-semibold leading-normal text-left",
            size === "small" ? "text-base" : "text-lg"
          )}>
            {title}
          </p>
        )}
        {description && (
          <p className={cn(
            "font-normal text-left",
            size === "small" ? "text-base leading-6" : "text-lg leading-[30px]"
          )}>
            {description}
          </p>
        )}
        {children}
      </div>
    </RadioGroupPrimitive.Item>
  )
})
RadioCard.displayName = "RadioCard"

export { RadioCardGroup, RadioCard, radioCardVariants }
