'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { FileText, Link2, PenLine, ArrowRight, ShieldCheck } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { Button } from '@/components/ui/button'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' as const, delay: i * 0.08 } }),
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="w-full border-b border-border bg-muted shrink-0">
        <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 h-14 flex items-center">
          <p className="text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">
            NSW Advance Care Directive
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 py-16 md:py-24 flex flex-col gap-20 md:gap-28 flex-1">

        {/* Hero */}
        <motion.div
          className="max-w-2xl flex flex-col gap-6"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.h1
            custom={0}
            variants={fadeUp}
            className="[font-size:var(--text-h1-sm)] md:[font-size:var(--text-display-2-sm)] [line-height:var(--leading-h1-sm)] md:[line-height:var(--leading-display-2-sm)] font-[family-name:var(--font-family-display)] text-foreground"
          >
            Your voice,<br />when it matters most
          </motion.h1>
          <motion.p
            custom={1}
            variants={fadeUp}
            className="[font-size:var(--text-base)] md:[font-size:var(--text-lg)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed max-w-xl"
          >
            An advance care directive helps doctors and your family understand what care you want — and don't want — if you're ever unable to speak for yourself.
          </motion.p>
          <motion.p
            custom={2}
            variants={fadeUp}
            className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed max-w-xl"
          >
            This takes around 15–20 minutes. You can pause and return any time using your session link.
          </motion.p>
          <motion.div custom={3} variants={fadeUp}>
            <Button size="lg" asChild className="h-12 md:h-11 gap-2 w-full md:w-auto">
              <Link href="/qa">
                Start my directive
                <ArrowRight size={18} strokeWidth={ICON_STROKE_WIDTH} />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* What you'll get */}
        <motion.div
          className="flex flex-col gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div custom={0} variants={fadeUp}>
            <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)] mb-3">
              What you'll get
            </p>
            <h2 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground max-w-lg">
              A document that speaks for you
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl">
            {[
              {
                icon: FileText,
                title: 'A signed PDF',
                body: 'Download a formal document you can give to your doctor, keep at home, or share with your family and healthcare team.',
              },
              {
                icon: Link2,
                title: 'A shareable link',
                body: 'Your directive lives at a private link you can send to anyone involved in your care — accessible from any device, any time.',
              },
              {
                icon: PenLine,
                title: 'Witness signature',
                body: 'Share a link for someone to witness your directive digitally. Witnessing is strongly recommended by NSW Health.',
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                custom={i + 1}
                variants={fadeUp}
                className="flex flex-col gap-3 p-5 rounded-lg border border-border bg-muted/40"
              >
                <Icon size={24} strokeWidth={ICON_STROKE_WIDTH} className="text-primary" />
                <h3 className="[font-size:var(--text-base)] font-semibold text-foreground font-[family-name:var(--font-family-body)]">
                  {title}
                </h3>
                <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* About + Privacy */}
        <motion.div
          className="flex flex-col gap-8 max-w-2xl"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div custom={0} variants={fadeUp}>
            <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)] mb-3">
              About this tool
            </p>
            <h2 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground mb-6">
              Independent. Transparent. Free.
            </h2>
          </motion.div>

          <motion.div custom={1} variants={fadeUp} className="flex flex-col gap-4">
            <div className="flex gap-3 p-4 rounded-lg border border-border bg-muted/40">
              <ShieldCheck size={20} strokeWidth={ICON_STROKE_WIDTH} className="shrink-0 mt-0.5 text-muted-foreground" />
              <div className="flex flex-col gap-2">
                <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                  This is an independent tool to help NSW residents prepare an advance care directive in line with NSW Health's advance care planning framework. It is not affiliated with or endorsed by NSW Health.
                </p>
                <a
                  href="https://www.health.nsw.gov.au/patients/acp/Pages/default.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="[font-size:var(--text-base)] font-medium text-link underline underline-offset-2 hover:no-underline w-fit font-[family-name:var(--font-family-body)]"
                >
                  Learn more at NSW Health →
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div custom={2} variants={fadeUp} className="flex flex-col gap-3">
            <h3 className="[font-size:var(--text-base)] font-semibold text-foreground font-[family-name:var(--font-family-body)]">
              Your privacy
            </h3>
            <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
              Your answers are saved to a secure cloud database linked to your session — no account or login required. We do not sell or share your data with third parties.
            </p>
            <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
              We recommend downloading your PDF as your permanent record. Keep your session link somewhere safe so you can return to update or share your directive.
            </p>
          </motion.div>

          <motion.div custom={3} variants={fadeUp}>
            <Button size="lg" asChild className="h-12 md:h-11 gap-2 w-full md:w-auto">
              <Link href="/qa">
                Start my directive
                <ArrowRight size={18} strokeWidth={ICON_STROKE_WIDTH} />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

      </div>

      {/* Footer */}
      <div className="w-full border-t border-border bg-muted shrink-0">
        <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 h-14 flex items-center">
          <p className="text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">
            Not affiliated with NSW Health or any government body.
          </p>
        </div>
      </div>

    </div>
  )
}
