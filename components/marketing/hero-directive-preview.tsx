'use client'

import { motion, useReducedMotion } from 'motion/react'

const SAMPLE_VALUES = ['Family', 'Closeness', 'Belonging']

// A hand-drawn style signature, drawn left to right on load
const SIGNATURE_PATH =
  'M4 30 C 10 8, 22 6, 20 24 C 18 38, 8 34, 16 22 C 24 10, 34 12, 33 26 C 32 34, 40 34, 45 22 C 49 13, 55 15, 54 26 C 53 33, 60 33, 66 21 C 70 13, 78 15, 76 26 C 74 35, 88 31, 98 19 C 104 12, 110 16, 106 24 C 103 30, 112 30, 124 22 L 156 18'

const labelClass =
  '[font-size:var(--text-xs)] uppercase tracking-[0.12em] text-muted-foreground font-[family-name:var(--font-family-body)]'

/**
 * Hero visual: a preview of the finished directive, styled as a sheet of
 * paper (solid at the top, fading to see-through) with a second page behind.
 * Decorative only — the page text already says what the product does.
 */
export function HeroDirectivePreview() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden="true"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
      className="relative h-full w-[400px] xl:w-[460px]"
    >
      {/* Second page peeking out behind */}
      <div
        className="absolute inset-0 rounded-md rotate-[3deg] translate-x-3 translate-y-2 backdrop-blur-sm"
        style={{ background: 'var(--mkt-paper-back)', boxShadow: 'var(--mkt-paper-shadow)' }}
      />

      {/* Front page */}
      <div
        className="relative h-full -rotate-2 rounded-md backdrop-blur-md text-card-foreground flex flex-col gap-9 px-8 pt-7 pb-8 xl:px-10 xl:pt-8 xl:pb-10"
        style={{ background: 'var(--mkt-paper)', boxShadow: 'var(--mkt-paper-shadow)' }}
      >
        <header className="flex items-baseline justify-between gap-4 pb-3 border-b" style={{ borderColor: 'var(--mkt-paper-rule)' }}>
          <span className={labelClass}>Advance care directive</span>
          <span className={labelClass}>NSW</span>
        </header>

        <h2 className="[font-size:var(--text-h1-lg)] [line-height:var(--leading-h1-lg)] font-[family-name:var(--font-family-display)] font-light">
          My care wishes
        </h2>

        <section className="flex flex-col gap-3">
          <h3 className={labelClass}>What matters most to me</h3>
          <ul className="flex flex-wrap gap-2">
            {SAMPLE_VALUES.map((value) => (
              <li
                key={value}
                className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground [font-size:var(--text-sm)] font-[family-name:var(--font-family-body)]"
              >
                {value}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className={labelClass}>In my own words</h3>
          <p className="[font-size:var(--text-lg)] [line-height:var(--leading-body-lg)] font-[family-name:var(--font-family-display)] font-light">
            &ldquo;If I can, I want to be at home, with the people I love close by.&rdquo;
          </p>
        </section>

        {/* mt-auto keeps the signature at the bottom when the page stretches to the hero text height */}
        <footer className="mt-auto grid grid-cols-[1fr_auto] gap-8 pt-2">
          <div className="flex flex-col">
            <svg viewBox="0 0 160 40" className="w-40 h-10 -mb-1" fill="none">
              <motion.path
                d={SIGNATURE_PATH}
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: 'easeInOut', delay: 1 }}
              />
            </svg>
            <div className="border-t pt-1.5" style={{ borderColor: 'var(--mkt-paper-rule)' }}>
              <span className={labelClass}>Signature</span>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <span suppressHydrationWarning className="[font-size:var(--text-sm)] pb-1.5 font-[family-name:var(--font-family-body)]">
              {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <div className="border-t pt-1.5" style={{ borderColor: 'var(--mkt-paper-rule)' }}>
              <span className={labelClass}>Date</span>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  )
}
