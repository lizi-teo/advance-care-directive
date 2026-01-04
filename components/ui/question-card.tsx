import * as React from "react"
import { cn } from "@/lib/utils"
import { HeartHandshake, Play, Info } from "lucide-react"

interface QuestionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  caption?: string
  title: string
  onPlayClick?: () => void
  onLearnMoreClick?: () => void
  size?: "small" | "large"
  showImage?: boolean
  imageUrl?: string
}

const QuestionCard = React.forwardRef<HTMLDivElement, QuestionCardProps>(
  (
    {
      caption = "Caption",
      title,
      onPlayClick,
      onLearnMoreClick,
      size = "small",
      showImage = false,
      imageUrl,
      className,
      ...props
    },
    ref
  ) => {
    const isSmall = size === "small"
    const isLarge = size === "large"

    return (
      <div
        ref={ref}
        data-size={size}
        className={cn(
          "relative flex flex-col",
          // Width: mobile 393px max (small) or full width, desktop 868px max (large)
          isSmall && "w-full max-w-[393px]",
          isLarge && "w-full max-w-[868px]",
          // Padding: small = 20px (p-5), large = 32px (p-8)
          isSmall && "p-5",
          isLarge && "p-8",
          // Gap: small = 20px (gap-5), large = 24px (gap-6)
          isSmall && "gap-5",
          isLarge && "gap-6",
          // Border radius: small = 24px (rounded-3xl), large = none
          isSmall && "rounded-3xl overflow-hidden",
          // Custom class for gradient background (auto-switches via CSS based on theme)
          "question-card-gradient",
          className
        )}
        {...props}
      >
        {/* Top row: Icon/Caption and Play Button */}
        <div className="flex items-start justify-between gap-4 w-full">
          {/* Left: Icon and Caption */}
          <div className="flex flex-col gap-4">
            {/* Icon: 64px on both mobile and desktop */}
            <div className="shrink-0 w-16 h-16">
              <HeartHandshake className="w-full h-full text-foreground" strokeWidth={0.5} />
            </div>

            {/* Caption - Responsive Typography
                Small: 12px (text-xs), Desktop: 14px (text-sm)
            */}
            {caption && (
              <p
                className={cn(
                  "uppercase leading-tight text-foreground font-[family-name:var(--font-family-body)]",
                  isSmall && "text-xs md:text-sm",
                  isLarge && "text-sm"
                )}
              >
                {caption}
              </p>
            )}
          </div>

          {/* Right: Play Button */}
          <button
            onClick={onPlayClick}
            className={cn(
              "shrink-0 rounded-full bg-primary flex items-center justify-center transition-opacity hover:opacity-90",
              "w-16 h-16"
            )}
            aria-label="Play"
          >
            <Play className="w-8 h-8 text-primary-foreground" strokeWidth={0.5} />
          </button>
        </div>

        {/* Title - Responsive Typography */}
        <h2
          className={cn(
            "text-foreground",
            "font-[family-name:var(--font-family-display)]",
            "font-[var(--font-weight-display)]",
            isSmall && [
              // Small H1: mobile 30px/40px, desktop 36px/42px
              "text-[length:var(--text-h1-sm)] leading-[var(--leading-h1-sm)]",
              "md:text-[length:var(--text-h1-lg)] md:leading-[var(--leading-h1-lg)]",
            ],
            isLarge && [
              // Large H1: 36px/42px on all screens
              "text-[length:var(--text-h1-lg)] leading-[var(--leading-h1-lg)]",
            ]
          )}
        >
          {title}
        </h2>

        {/* Learn More Link */}
        <button
          onClick={onLearnMoreClick}
          className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity self-start"
        >
          <Info
            className={cn(
              isSmall && "w-5 h-5",
              isLarge && "w-6 h-6"
            )}
            strokeWidth={0.5}
          />
          <span
            className={cn(
              "underline underline-offset-2 font-[family-name:var(--font-family-body)]",
              isSmall && "text-base leading-tight",
              isLarge && "text-lg leading-[var(--leading-body-lg)]"
            )}
          >
            Tell me more
          </span>
        </button>

        {/* Image for small size */}
        {isSmall && showImage && imageUrl && (
          <div className="h-[120px] -mb-5 -mr-5 -ml-5 relative overflow-hidden">
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
          </div>
        )}
      </div>
    )
  }
)

QuestionCard.displayName = "QuestionCard"

export { QuestionCard }
