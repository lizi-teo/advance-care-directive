import * as React from "react"
import { cn } from "@/lib/utils"
import { Info } from "lucide-react"
import { Button } from "./button"
import { Skeleton } from "./skeleton"

interface QuestionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  caption?: string
  title: string
  onLearnMoreClick?: () => void
  size?: "small" | "large"
  showImage?: boolean
  imageUrl?: string
  roundedHeader?: boolean
}

const QuestionCard = React.forwardRef<HTMLDivElement, QuestionCardProps>(
  (
    {
      caption = "Caption",
      title,
      onLearnMoreClick,
      size = "small",
      showImage = false,
      imageUrl,
      roundedHeader = true,
      className,
      ...props
    },
    ref
  ) => {
    const [imageLoaded, setImageLoaded] = React.useState(false)
    const isSmall = size === "small"
    const isLarge = size === "large"

    // Reset loading state when imageUrl changes
    React.useEffect(() => {
      if (imageUrl) {
        setImageLoaded(false)
      }
    }, [imageUrl])

    return (
      <div
        ref={ref}
        data-size={size}
        className={cn(
          "relative flex flex-col",
          // Width: mobile 393px max (small) or full width, desktop 868px max (large)
          // When roundedHeader=false, remove max-width to extend to edges
          isSmall && roundedHeader && "w-full max-w-[393px]",
          isSmall && !roundedHeader && "w-full",
          isLarge && "w-full max-w-[868px]",
          // Padding: small = 20px (p-5), large = 32px (p-8)
          isSmall && "p-5",
          isLarge && "p-8",
          // Gap: small = 20px (gap-5), large = 24px (gap-6)
          isSmall && "gap-5",
          isLarge && "gap-6",
          // Border radius: small = 24px (rounded-3xl), large = none
          // roundedHeader=false removes rounded corners
          isSmall && roundedHeader && "rounded-3xl overflow-hidden",
          // Custom class for gradient background (auto-switches via CSS based on theme)
          "question-card-gradient",
          className
        )}
        {...props}
      >
        {/* Image for small size - positioned at top */}
        {isSmall && showImage && imageUrl && (
          <div className="h-[160px] -mt-5 -mr-5 -ml-5 mb-0 relative overflow-hidden">
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <img
              src={imageUrl}
              alt=""
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
          </div>
        )}

        {/* Caption */}
        {caption && (
          <p
            className={cn(
              "uppercase leading-tight text-foreground font-[family-name:var(--font-family-body)]",
              isSmall && "[font-size:var(--text-xs)] md:[font-size:var(--text-sm)]",
              isLarge && "[font-size:var(--text-sm)]"
            )}
          >
            {caption}
          </p>
        )}

        {/* Title - Responsive Typography */}
        <h1
          className={cn(
            "text-foreground",
            "font-[family-name:var(--font-family-display)]",
            "font-[var(--font-weight-display)]",
            isSmall && [
              // Small H1: mobile 30px, desktop 36px
              "[font-size:var(--text-h1-sm)]",
              "[line-height:var(--leading-h1-sm)]",
              "md:[font-size:var(--text-h1-lg)]",
              "md:[line-height:var(--leading-h1-lg)]",
            ],
            isLarge && [
              // Large H1: 36px on all screens
              "[font-size:var(--text-h1-lg)]",
              "[line-height:var(--leading-h1-lg)]",
            ]
          )}
        >
          {title}
        </h1>

        {/* Learn More Link - Only show if callback provided */}
        {onLearnMoreClick && (
          <Button
            variant="ghost-subtle"
            onClick={onLearnMoreClick}
            className={cn(
              "self-start h-auto px-0 py-2",
              isSmall && "[font-size:var(--text-base)]",
              isLarge && "[font-size:var(--text-lg)]"
            )}
          >
            <Info
              className={cn(
                isSmall && "w-5 h-5",
                isLarge && "w-6 h-6"
              )}
            />
            <span className="font-[family-name:var(--font-family-body)]">
              Tell me more
            </span>
          </Button>
        )}
      </div>
    )
  }
)

QuestionCard.displayName = "QuestionCard"

export { QuestionCard }
