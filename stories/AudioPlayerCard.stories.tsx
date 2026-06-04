import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { AudioPlayerCard } from "@/components/ui/audio-player-card"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const DEMO_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop"

const meta = {
  title: "UI/AudioPlayerCard",
  component: AudioPlayerCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    caption: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    image: { control: "text" },
    transcriptLabel: { control: "text" },
  },
} satisfies Meta<typeof AudioPlayerCard>

export default meta
type Story = StoryObj<typeof meta>

// ─── Mobile (small, vertical) ────────────────────────────────────────────────

export const MobileCard: Story = {
  args: {
    caption: "Introduction",
    title: "Your Advance Care Directive",
    description:
      "Learn what an Advance Care Directive means for you and the people who care about you.",
    image: DEMO_IMAGE,
    transcriptLabel: "View transcript",
    layout: "vertical",
  },
  decorators: [
    (Story) => (
      <div className="w-[353px] bg-background p-4">
        <Story />
      </div>
    ),
  ],
}

// ─── Desktop (large, horizontal) ─────────────────────────────────────────────

export const DesktopCard: Story = {
  args: {
    caption: "Introduction",
    title: "Your Advance Care Directive",
    description:
      "Learn what an Advance Care Directive means for you and the people who care about you.",
    image: DEMO_IMAGE,
    transcriptLabel: "View transcript",
    layout: "horizontal",
  },
  decorators: [
    (Story) => (
      <div className="w-[834px] bg-background p-8">
        <Story />
      </div>
    ),
  ],
}

// ─── Without image ────────────────────────────────────────────────────────────

export const WithoutImage: Story = {
  args: {
    caption: "Section 2",
    title: "Medical Treatment Preferences",
    description:
      "This short audio guides you through the types of medical treatment decisions you may need to consider.",
    transcriptLabel: "View transcript",
  },
  decorators: [
    (Story) => (
      <div className="w-[353px] bg-background p-4">
        <Story />
      </div>
    ),
  ],
}

// ─── Mobile modal pattern (onboarding flow) ───────────────────────────────────
// On mobile the card is shown inside a Dialog. The parent controls open state.

export const MobileModalPattern: Story = {
  args: {
    caption: "Introduction",
    title: "Your Advance Care Directive",
    description:
      "Learn what an Advance Care Directive means for you and the people who care about you.",
    image: DEMO_IMAGE,
    transcriptLabel: "View transcript",
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false)
    return (
      <div className="flex flex-col items-center gap-4 p-8 bg-background">
        <p className="text-sm text-muted-foreground">
          Simulates the mobile onboarding trigger → modal flow
        </p>
        <Button onClick={() => setOpen(true)}>Listen to introduction</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className={
              "p-0 border-0 bg-transparent shadow-none max-w-[353px] rounded-3xl overflow-hidden"
            }
          >
            <AudioPlayerCard {...args} />
          </DialogContent>
        </Dialog>
      </div>
    )
  },
}

// ─── All sizes side by side ───────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-12 bg-background p-8 max-w-[900px]">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
          Mobile (353px)
        </h3>
        <div className="max-w-[353px]">
          <AudioPlayerCard
            caption="Introduction"
            title="Your Advance Care Directive"
            description="Learn what an Advance Care Directive means for you and the people who care about you."
            image={DEMO_IMAGE}
            transcriptLabel="View transcript"
            layout="vertical"
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
          Desktop (834px)
        </h3>
        <AudioPlayerCard
          caption="Introduction"
          title="Your Advance Care Directive"
          description="Learn what an Advance Care Directive means for you and the people who care about you."
          image={DEMO_IMAGE}
          transcriptLabel="View transcript"
          layout="horizontal"
        />
      </div>
    </div>
  ),
  args: {
    title: "",
    description: "",
  },
}
