import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface HeaderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  caption?: string
  title: string
  body: string
  buttonLabel?: string
  onButtonClick?: () => void
  image?: string
  showRadius?: boolean
}

const HeaderCard = React.forwardRef<HTMLDivElement, HeaderCardProps>(
  (
    {
      caption,
      title,
      body,
      buttonLabel = "Button",
      onButtonClick,
      image,
      showRadius = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-image={image ? "true" : undefined}
        className={cn(
          "relative flex flex-col",
          // Desktop with image: switch to row layout (left column: text, right column: image)
          image && "md:flex-row md:items-end",
          // Gap: mobile 16px (gap-4), desktop 32px (gap-8) for two-column layout
          "gap-4 md:gap-8",
          // Container width: mobile 393px max, desktop 868px max
          "w-full max-w-[393px] md:max-w-[868px]",
          // Padding: mobile 20px (p-5), desktop 32px (p-8)
          "p-5 md:p-8",
          // Border radius: mobile 24px (rounded-3xl), desktop none or 24px based on variant
          showRadius && !image && "rounded-3xl overflow-hidden",
          // Custom class for gradient background (auto-switches via CSS based on theme)
          "header-card-gradient",
          className
        )}
        {...props}
      >
        {/* Left Column: Text Content (60% on desktop with image, full width otherwise) */}
        <div
          className={cn(
            "flex flex-col gap-4",
            // Desktop with image: 60% width (3:2 ratio), aligned to end for button
            image && "md:flex-[3] md:self-stretch md:justify-between"
          )}
        >
          <div className="flex flex-col gap-4">
            {/* Icon: mobile 64px, desktop 64px (stays consistent) */}
            <div className="shrink-0 w-16 h-16 md:w-16 md:h-16 relative">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M32 16V37.33"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="text-foreground"
                />
                <path
                  d="M32 26.67V32"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="text-foreground"
                />
                <path
                  d="M32 42.67V53.33"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="text-foreground"
                />
                <circle
                  cx="40"
                  cy="50.67"
                  r="3.33"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-foreground"
                />
                <circle
                  cx="24"
                  cy="50.67"
                  r="3.33"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-foreground"
                />
              </svg>
            </div>

            {/* Caption - Responsive Typography
                Mobile: 12px (text-xs), line-height 100% (leading-none)
                Desktop: 14px (text-sm), line-height 100% (leading-none)
            */}
            {caption && (
              <p className="text-xs md:text-sm uppercase leading-none text-foreground font-[family-name:var(--font-family-body)]">
                {caption}
              </p>
            )}

            {/* Title - Responsive Typography
                Without image:
                  Mobile: 36px (text-4xl), line-height 50px
                  Desktop: 60px (text-6xl), line-height 66px
                With image:
                  Mobile: 48px (text-5xl), line-height 58px
                  Desktop: 72px (text-7xl), line-height 80px
            */}
            <h2
              className={cn(
                "text-foreground",
                "font-[family-name:var(--font-family-display)]",
                "font-[var(--font-weight-display)]",
                !image && [
                  // Display 2: mobile 36px/50px, desktop 60px/66px
                  "text-[2.25rem] leading-[3.125rem]",
                  "md:text-[3.75rem] md:leading-[4.125rem]",
                ],
                image && [
                  // Display 1: mobile 48px/58px, desktop 72px/80px
                  "text-[3rem] leading-[3.625rem]",
                  "md:text-[4.5rem] md:leading-[5rem]",
                ]
              )}
            >
              {title}
            </h2>

            {/* Body text - Responsive Typography
                Mobile: 16px (text-base), line-height 24px (leading-6)
                Desktop: 18px (text-lg), line-height 30px (leading-[1.875rem])
            */}
            <p
              className={cn(
                "text-foreground",
                "font-[family-name:var(--font-family-body)]",
                // Mobile: 16px/24px, Desktop: 18px/30px
                "text-base leading-6",
                "md:text-lg md:leading-[1.875rem]"
              )}
            >
              {body}
            </p>
          </div>

          {/* Button - Responsive sizing and typography
              Mobile: height 48px (h-12), padding 20px (px-5), full width
              Desktop: height 48px (h-12), padding 32px (px-8), width 300px
              Typography: 16px semibold, line-height 100%
          */}
          <Button
            onClick={onButtonClick}
            className={cn(
              // Width: mobile full, desktop 300px
              "w-full md:w-[300px]",
              // Height: 48px on both mobile and desktop
              "h-12",
              // Padding: mobile 20px, desktop 32px
              "px-5 md:px-8",
              // Border radius: full (9999px)
              "rounded-full",
              // Typography: 16px semibold, line-height 100%
              "font-[family-name:var(--font-family-body)] font-semibold text-base leading-none"
            )}
          >
            {buttonLabel}
          </Button>
        </div>

        {/* Right Column: Image (40% on desktop, full width mobile) */}
        {image && (
          <div
            className={cn(
              "relative w-full rounded-bl-full rounded-br-full overflow-hidden shrink-0",
              // Mobile: 202px height, full width
              "h-[202px]",
              // Desktop: 40% width (2:3 ratio), auto height to match content
              "md:flex-[2] md:h-auto md:min-h-[280px] md:self-stretch"
            )}
          >
            <img
              src={image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    )
  }
)

HeaderCard.displayName = "HeaderCard"

export { HeaderCard }
