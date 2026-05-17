'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { FileText, Link2, Signature, ArrowRight, HeartHandshake, FileKey, ChevronRight } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { Button } from '@/components/ui/button'
import { AppBar } from '@/components/ui/app-bar'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' as const, delay: i * 0.08 } }),
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">

      <AppBar />

      {/* Hero banner */}
      <section className="w-full shrink-0" style={{ background: 'var(--gradient-brand)' }}>
        <motion.div
          className="page-container py-8 md:py-14 lg:py-16 flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
        >
          {/* Left: text */}
          <div className="flex-1 flex flex-col gap-6 max-w-2xl lg:max-w-none">
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="[font-size:var(--text-display-1-sm)] md:[font-size:var(--text-display-1-sm)] lg:[font-size:var(--text-display-1-lg)] [line-height:var(--leading-display-1-sm)] lg:[line-height:var(--leading-display-1-lg)] font-[family-name:var(--font-family-display)] font-light text-white"
            >
              Make your wishes known
            </motion.h1>
            <motion.div custom={2} variants={fadeUp} className="flex flex-col gap-5 max-w-lg">
              <p className="[font-size:var(--text-base)] md:[font-size:var(--text-lg)] text-white/80 font-[family-name:var(--font-family-display)] [line-height:var(--leading-body)]">
                An Advance Care Directive lets you share what matters to you about medical care, in case you're ever seriously ill and can't communicate.
              </p>
              <p className="[font-size:var(--text-base)] md:[font-size:var(--text-lg)] text-white/80 font-[family-name:var(--font-family-display)] [line-height:var(--leading-body)]">
                It helps the people who care about you make decisions you'd be comfortable with.
              </p>
              <p className="[font-size:var(--text-base)] md:[font-size:var(--text-lg)] text-white/80 font-[family-name:var(--font-family-display)] [line-height:var(--leading-body)]">
                This takes around <span className="font-semibold">15–20 minutes</span>. Completely free.
              </p>
            </motion.div>
            <motion.div custom={3} variants={fadeUp}>
              <Button
                size="lg"
                asChild
                className="rounded-full h-12 px-8 gap-2 w-full md:w-auto"
              >
                <Link href="/qa">
                  Start my directive
                  <ArrowRight size={18} strokeWidth={ICON_STROKE_WIDTH} />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right: landscape image */}
          <motion.div
            custom={4}
            variants={fadeUp}
            className="hidden lg:block flex-1 self-stretch relative min-h-[440px] rounded-tl-[96px] rounded-b-[9999px] overflow-hidden"
          >
            <Image
              src="/images/hero-landscape.png"
              alt="A serene watercolour landscape — soft mountains at dusk"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>
      </section>

      {/* What you'll get — full-bleed dark section */}
      <section className="w-full shrink-0" style={{ background: '#1B1724' }}>
        <motion.div
          className="page-container py-10 md:py-20 flex flex-col gap-8 md:gap-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div custom={0} variants={fadeUp}>
            <h2 className="section-heading text-white">
              What you'll get
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
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
                icon: Signature,
                title: 'Witness signature',
                body: 'Share a link for someone to witness your directive digitally. Witnessing is strongly recommended by NSW Health.',
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                custom={i + 1}
                variants={fadeUp}
                className="flex flex-col gap-4 p-5 rounded-3xl"
                style={{ background: '#292337' }}
              >
                <Icon size={40} strokeWidth={ICON_STROKE_WIDTH} className="text-white/80" />
                <h3 className="[font-size:var(--text-lg)] md:[font-size:var(--text-xl)] lg:[font-size:var(--text-2xl)] [line-height:var(--leading-body-lg)] md:[line-height:var(--leading-xl)] lg:[line-height:var(--leading-2xl)] font-[family-name:var(--font-family-display)] font-light text-white">
                  {title}
                </h3>
                <p className="[font-size:var(--text-base)] text-white/70 font-[family-name:var(--font-family-body)] leading-relaxed">
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About + Privacy — full-bleed dark section */}
      <section className="w-full shrink-0" style={{ background: '#292337' }}>
        <motion.div
          className="page-container py-10 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          {/* Left: About */}
          <motion.div custom={0} variants={fadeUp} className="flex flex-col gap-6">
            <HeartHandshake size={40} strokeWidth={ICON_STROKE_WIDTH} className="text-white/80" />
            <div className="flex flex-col gap-5">
              <h3 className="[font-size:var(--text-xl)] md:[font-size:var(--text-2xl)] [line-height:var(--leading-xl)] md:[line-height:var(--leading-2xl)] font-[family-name:var(--font-family-display)] font-light text-white">
                Independent. Transparent. Free.
              </h3>
              <div className="flex flex-col gap-6">
                <p className="[font-size:var(--text-base)] md:[font-size:var(--text-lg)] text-white/80 font-[family-name:var(--font-family-display)] [line-height:var(--leading-body)]">
                  Preparing an advance care directive can feel overwhelming — especially when time is short. This tool was built out of goodwill to make that process simpler and more accessible for anyone who needs it.
                </p>
                <p className="[font-size:var(--text-base)] md:[font-size:var(--text-lg)] text-white/80 font-[family-name:var(--font-family-display)] [line-height:var(--leading-body)]">
                  It is an independent tool, not affiliated with or endorsed by NSW Health, and follows NSW Health's advance care planning framework.
                </p>
              </div>
            </div>
            <a
              href="https://www.health.nsw.gov.au/patients/acp/Pages/default.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 [font-size:var(--text-sm)] font-[family-name:var(--font-family-body)] underline underline-offset-2 hover:no-underline w-fit"
              style={{ color: '#D0B9FB' }}
            >
              Visit NSW Health
              <ChevronRight size={16} strokeWidth={ICON_STROKE_WIDTH} />
            </a>
          </motion.div>

          {/* Right: Privacy */}
          <motion.div custom={1} variants={fadeUp} className="flex flex-col gap-6">
            <FileKey size={40} strokeWidth={ICON_STROKE_WIDTH} className="text-white/80" />
            <div className="flex flex-col gap-5">
              <h3 className="[font-size:var(--text-xl)] md:[font-size:var(--text-2xl)] [line-height:var(--leading-xl)] md:[line-height:var(--leading-2xl)] font-[family-name:var(--font-family-display)] font-light text-white">
                Your privacy
              </h3>
              <div className="flex flex-col gap-6">
                <p className="[font-size:var(--text-base)] md:[font-size:var(--text-lg)] text-white/80 font-[family-name:var(--font-family-display)] [line-height:var(--leading-body)]">
                  Your answers are saved to a secure cloud database linked to your session — no account or login required. We do not sell or share your data with third parties.
                </p>
                <p className="[font-size:var(--text-base)] md:[font-size:var(--text-lg)] text-white/80 font-[family-name:var(--font-family-display)] [line-height:var(--leading-body)]">
                  We recommend downloading your PDF as your permanent record. Keep your session link somewhere safe so you can return to update or share your directive.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <div className="w-full border-t border-border bg-muted shrink-0">
        <div className="page-container h-14 flex items-center">
          <p className="text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">
            Not affiliated with NSW Health or any government body.
          </p>
        </div>
      </div>

    </div>
  )
}
