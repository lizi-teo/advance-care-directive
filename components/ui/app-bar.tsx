import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ALargeSmall, ChevronLeft, Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ICON_STROKE_WIDTH } from "@/lib/theme-config"

const appBarVariants = cva(
  "flex items-center justify-between bg-muted w-full",
  {
    variants: {
      size: {
        small: "h-12 px-5", // 48px height, 20px padding (mobile)
        large: "h-14 px-8", // 56px height, 32px padding (desktop)
      },
    },
    defaultVariants: {
      size: "small",
    },
  }
)

export interface AppBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appBarVariants> {
  type?: "back" | "progression" | "login" | "close"
  onBack?: () => void
  onClose?: () => void
  onFontSize?: () => void
  onLogin?: () => void
  onGetStarted?: () => void
  onMenu?: () => void
  progressText?: string
  nextText?: string
  avatarLabel?: string
  brandText?: string
}

const AppBar = React.forwardRef<HTMLDivElement, AppBarProps>(
  (
    {
      className,
      type = "back",
      size = "small",
      onBack,
      onClose,
      onFontSize,
      onLogin,
      onGetStarted,
      onMenu,
      progressText = "1 of 3",
      nextText = "Next: Connection",
      avatarLabel = "L",
      brandText = "AU ACD",
      ...props
    },
    ref
  ) => {
    const isSmall = size === "small"
    const buttonSize = isSmall ? "sm" : "default"
    const iconSize = isSmall ? 24 : 32
    const avatarSize = isSmall ? "size-8" : "size-12"

    return (
      <div
        ref={ref}
        className={cn(appBarVariants({ size }), className)}
        {...props}
      >
        {/* Back Variant */}
        {type === "back" && (
          <>
            <Button
              variant="ghost"
              size={buttonSize}
              onClick={onBack}
              className="gap-2 h-12"
            >
              <ChevronLeft size={iconSize} strokeWidth={ICON_STROKE_WIDTH} />
              <span className="text-lg font-medium">Back</span>
            </Button>
            <div /> {/* Empty spacer for layout */}
          </>
        )}

        {/* Progression Variant */}
        {type === "progression" && (
          <>
            <div className="flex items-center gap-5 md:gap-8">
              <div className="flex flex-col justify-center text-sm md:text-base text-primary-foreground">
                <p className="leading-none">{progressText}</p>
              </div>
              {isSmall && (
                <div className="flex flex-col justify-center text-sm text-primary-foreground text-right">
                  <p className="leading-none">{nextText}</p>
                </div>
              )}
              {!isSmall && (
                <div className="flex flex-col justify-center text-base text-primary-foreground text-right">
                  <p className="leading-none">{nextText}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              {!isSmall && (
                <>
                  <Button
                    variant="ghost-subtle"
                    size="icon"
                    onClick={onFontSize}
                    className="h-auto w-auto p-0"
                    aria-label="Change font size"
                  >
                    <ALargeSmall size={iconSize + 8} strokeWidth={ICON_STROKE_WIDTH} />
                  </Button>
                  <Button
                    variant="ghost-subtle"
                    size="icon"
                    onClick={onClose}
                    className="h-auto w-auto p-0"
                    aria-label="Close"
                  >
                    <X size={iconSize + 8} strokeWidth={ICON_STROKE_WIDTH} />
                  </Button>
                </>
              )}
              {isSmall && (
                <>
                  <Button
                    variant="ghost-subtle"
                    size="icon"
                    onClick={onFontSize}
                    className="h-auto w-auto p-0"
                    aria-label="Change font size"
                  >
                    <ALargeSmall size={iconSize + 12} strokeWidth={ICON_STROKE_WIDTH} />
                  </Button>
                  <Button
                    variant="ghost-subtle"
                    size="icon"
                    onClick={onClose}
                    className="h-auto w-auto p-0"
                    aria-label="Close"
                  >
                    <X size={iconSize + 12} strokeWidth={ICON_STROKE_WIDTH} />
                  </Button>
                </>
              )}
            </div>
          </>
        )}

        {/* Login Variant */}
        {type === "login" && (
          <>
            <div className="flex items-center gap-2">
              <p className="text-sm md:text-base text-primary-foreground">
                {brandText}
              </p>
              <Button
                variant="ghost-subtle"
                size="icon"
                onClick={onMenu}
                className="h-auto w-auto p-0"
                aria-label="Menu"
              >
                <Menu size={iconSize} strokeWidth={ICON_STROKE_WIDTH} />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size={buttonSize}
                onClick={onLogin}
                className={isSmall ? "h-10" : "h-12"}
              >
                Log in
              </Button>
              <Button
                variant="secondary"
                size={buttonSize}
                onClick={onGetStarted}
                className={isSmall ? "h-10 px-5" : "h-12 px-8"}
              >
                Get started
              </Button>
            </div>
          </>
        )}

        {/* Close Variant */}
        {type === "close" && (
          <>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost-subtle"
                size="icon"
                onClick={onMenu}
                className="h-auto w-auto p-0"
                aria-label="Menu"
              >
                <Menu size={iconSize} strokeWidth={ICON_STROKE_WIDTH} />
              </Button>
              <p className="text-sm md:text-base text-primary-foreground">
                {brandText}
              </p>
            </div>
            <Avatar className={cn(avatarSize)}>
              <AvatarFallback className="bg-primary text-primary-foreground font-medium font-[family-name:var(--font-family-display)]">
                {avatarLabel}
              </AvatarFallback>
            </Avatar>
          </>
        )}
      </div>
    )
  }
)
AppBar.displayName = "AppBar"

export { AppBar, appBarVariants }
