"use client"

import * as React from "react"
import { Play, Pause, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

export interface AudioPlayerCardProps {
  caption?: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  audioSrc?: string
  transcriptLabel?: string
  onTranscriptClick?: () => void
  /** "auto" uses viewport breakpoints (default). "vertical" and "horizontal" force the layout. */
  layout?: "auto" | "vertical" | "horizontal"
  className?: string
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function AudioPlayerCard({
  caption,
  title,
  description,
  image,
  imageAlt = "",
  audioSrc,
  transcriptLabel = "Description",
  onTranscriptClick,
  layout = "auto",
  className,
}: AudioPlayerCardProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => setDuration(isFinite(audio.duration) ? audio.duration : 0)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("durationchange", onDurationChange)
    audio.addEventListener("ended", onEnded)
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("durationchange", onDurationChange)
      audio.removeEventListener("ended", onEnded)
    }
  }, [])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      void audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  function handleSeek(value: number[]) {
    const audio = audioRef.current
    if (!audio || value[0] === undefined) return
    audio.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const remaining = Math.max(0, duration - currentTime)

  return (
    <div
      className={cn(
        "bg-muted rounded-3xl overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]",
        "flex",
        layout === "horizontal" && "flex-row",
        layout === "vertical" && "flex-col",
        layout === "auto" && "flex-col md:flex-row",
        className
      )}
    >
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} preload="metadata" />
      )}

      {/* Image: full-width square on mobile, left half on desktop */}
      {image && (
        <div
          className={cn(
            "relative shrink-0 overflow-hidden",
            // vertical: full-width square
            (layout === "vertical" || layout === "auto") && "aspect-square w-full",
            // horizontal: left half, full height
            layout === "horizontal" && "aspect-auto w-1/2 self-stretch",
            // auto: switches at md breakpoint
            layout === "auto" && "md:aspect-auto md:w-1/2 md:self-stretch"
          )}
        >
          <img
            src={image}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          "flex flex-col gap-5 p-8 justify-center",
          image && layout === "horizontal" && "w-1/2",
          image && layout === "auto" && "md:w-1/2"
        )}
      >
        {caption && (
          <p className="text-xs uppercase leading-none tracking-wide text-foreground font-[family-name:var(--font-family-body)]">
            {caption}
          </p>
        )}

        <h2 className="text-2xl leading-9 text-foreground font-[family-name:var(--font-family-display)] font-[var(--font-weight-regular)]">
          {title}
        </h2>

        <p className="text-base leading-6 text-foreground font-[family-name:var(--font-family-body)]">
          {description}
        </p>

        {/* Progress slider — overrides default track/range/thumb colours */}
        <Slider
          value={[currentTime]}
          max={duration || 1}
          step={0.5}
          onValueChange={handleSeek}
          aria-label="Audio playback position"
          className={cn(
            "[&_[data-slot=slider-track]]:bg-background",
            "[&_[data-slot=slider-range]]:bg-foreground",
            "[&_[data-slot=slider-thumb]]:bg-foreground",
            "[&_[data-slot=slider-thumb]]:border-0",
            "[&_[data-slot=slider-thumb]]:shadow-none"
          )}
        />

        {/* Time display */}
        <div className="flex items-center justify-between">
          <span
            aria-live="polite"
            aria-label={`Current time: ${formatTime(currentTime)}`}
            className="text-xs uppercase leading-none text-foreground font-[family-name:var(--font-family-body)] tabular-nums"
          >
            {formatTime(currentTime)}
          </span>
          <span
            className="text-xs uppercase leading-none text-foreground font-[family-name:var(--font-family-body)] tabular-nums"
          >
            -{formatTime(remaining)}
          </span>
        </div>

        {/* Play / Pause */}
        <div className="flex items-center justify-center w-full">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
            className={cn(
              "bg-primary rounded-full size-16 flex items-center justify-center shrink-0",
              "transition-opacity hover:opacity-90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
            )}
          >
            {isPlaying ? (
              <Pause size={32} className="text-primary-foreground" />
            ) : (
              <Play size={32} className="text-primary-foreground fill-primary-foreground" />
            )}
          </button>
        </div>

        {/* Transcript / description link — right-aligned on mobile, left on desktop */}
        {transcriptLabel && (
          <div className="flex items-center justify-end md:justify-start">
            <button
              type="button"
              onClick={onTranscriptClick}
              className={cn(
                "flex items-center gap-2 text-base leading-none text-foreground underline",
                "font-[family-name:var(--font-family-body)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              )}
            >
              <FileText size={20} aria-hidden />
              <span>{transcriptLabel}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
