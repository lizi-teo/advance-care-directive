import type { Meta, StoryObj } from '@storybook/react';
import { HeaderCard } from '@/components/ui/header-card';

const meta = {
  title: 'UI/HeaderCard',
  component: HeaderCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    caption: {
      control: 'text',
      description: 'Optional caption text (uppercase, small)',
    },
    title: {
      control: 'text',
      description: 'Main title text',
    },
    body: {
      control: 'text',
      description: 'Body text content',
    },
    buttonLabel: {
      control: 'text',
      description: 'Button label',
    },
    image: {
      control: 'text',
      description: 'Optional decorative image URL',
    },
    showRadius: {
      control: 'boolean',
      description: 'Show rounded corners (24px border radius)',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeaderCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default - Without image, with radius (most common use case)
export const Default: Story = {
  args: {
    caption: 'Optional',
    title: 'Welcome to Your Advance Care Directive',
    body: 'This is where you can record your wishes for future healthcare decisions.',
    buttonLabel: 'Get Started',
    showRadius: true,
  },
};

// With Caption
export const WithCaption: Story = {
  args: {
    caption: 'Step 1 of 5',
    title: 'Understanding Your Values',
    body: 'Let us help you think about what matters most to you in your care.',
    buttonLabel: 'Continue',
    showRadius: true,
  },
};

// Without Caption
export const WithoutCaption: Story = {
  args: {
    title: 'Your Healthcare Wishes',
    body: 'Document your preferences for medical treatment and care in a way that honors your values.',
    buttonLabel: 'Begin',
    showRadius: true,
  },
};

// With Decorative Image
export const WithImage: Story = {
  args: {
    caption: 'Wellness',
    title: 'Peace of Mind',
    body: 'Take control of your future healthcare decisions today.',
    buttonLabel: 'Start Journey',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop',
    showRadius: true,
  },
};

// Without Radius
export const WithoutRadius: Story = {
  args: {
    title: 'Sharp Corners Design',
    body: 'This variant has no border radius for a more modern, sharp aesthetic.',
    buttonLabel: 'Continue',
    showRadius: false,
  },
};

// Long Content
export const LongContent: Story = {
  args: {
    caption: 'Important Information',
    title: 'Understanding Your Rights and Responsibilities',
    body: 'This is a longer body text to demonstrate how the component handles more content. Your advance care directive is a legal document that allows you to make decisions about your future healthcare. It ensures your wishes are known and respected, even when you cannot communicate them yourself.',
    buttonLabel: 'I Understand',
    showRadius: true,
  },
};

// Mobile Preview (393px max-width)
export const MobilePreview: Story = {
  args: {
    caption: 'Mobile View',
    title: 'Optimized for Small Screens',
    body: 'This shows how the component looks on mobile devices with 393px max width.',
    buttonLabel: 'Continue',
    showRadius: true,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[393px] p-4 bg-background">
        <Story />
      </div>
    ),
  ],
};

// Desktop Preview (868px max-width)
export const DesktopPreview: Story = {
  args: {
    caption: 'Desktop View',
    title: 'Optimized for Large Screens',
    body: 'This shows how the component looks on desktop with 868px max width and larger typography.',
    buttonLabel: 'Get Started',
    showRadius: true,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[868px] p-8 bg-background">
        <Story />
      </div>
    ),
  ],
};

// With Image - Mobile
export const WithImageMobile: Story = {
  args: {
    caption: 'Mindfulness',
    title: 'Finding Clarity',
    body: 'Reflect on what matters most to you.',
    buttonLabel: 'Begin Reflection',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    showRadius: true,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[393px] p-4 bg-background">
        <Story />
      </div>
    ),
  ],
};

// With Image - Desktop
export const WithImageDesktop: Story = {
  args: {
    caption: 'Serenity',
    title: 'Your Journey Begins Here',
    body: 'Take the first step toward documenting your healthcare preferences with confidence.',
    buttonLabel: 'Start Now',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&h=450&fit=crop',
    showRadius: true,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[868px] p-8 bg-background">
        <Story />
      </div>
    ),
  ],
};

// Real-world Example: Onboarding
export const OnboardingExample: Story = {
  args: {
    caption: 'Welcome',
    title: 'Plan Your Future Healthcare',
    body: 'Creating an advance care directive helps ensure your healthcare wishes are honored. We will guide you through each step with care and clarity.',
    buttonLabel: 'Begin Planning',
    showRadius: true,
  },
};

// Real-world Example: Section Intro
export const SectionIntroExample: Story = {
  args: {
    caption: 'Chapter 3',
    title: 'Medical Treatment Preferences',
    body: 'In this section, you will be asked to consider your preferences for different types of medical treatments and interventions.',
    buttonLabel: 'Continue to Questions',
    showRadius: true,
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-12 max-w-[900px]">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Default (Mobile - 393px)
        </h3>
        <div className="max-w-[393px]">
          <HeaderCard
            caption="Step 1"
            title="Getting Started"
            body="Your journey begins here with thoughtful planning."
            buttonLabel="Continue"
            showRadius={true}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Default (Desktop - 868px)
        </h3>
        <div className="max-w-[868px]">
          <HeaderCard
            caption="Step 1"
            title="Getting Started"
            body="Your journey begins here with thoughtful planning and careful consideration."
            buttonLabel="Continue"
            showRadius={true}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          With Image (Mobile - 393px)
        </h3>
        <div className="max-w-[393px]">
          <HeaderCard
            title="Peace of Mind"
            body="Document your wishes with confidence."
            buttonLabel="Start"
            image="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop"
            showRadius={true}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          With Image (Desktop - 868px)
        </h3>
        <div className="max-w-[868px]">
          <HeaderCard
            title="Your Healthcare Journey"
            body="Take control of your future healthcare decisions with a comprehensive advance care directive."
            buttonLabel="Get Started"
            image="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&h=450&fit=crop"
            showRadius={true}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Without Radius
        </h3>
        <div className="max-w-[393px]">
          <HeaderCard
            caption="Modern"
            title="Sharp Design"
            body="Clean edges for a contemporary look."
            buttonLabel="Continue"
            showRadius={false}
          />
        </div>
      </div>
    </div>
  ),
};

// Responsive Comparison
export const ResponsiveComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Mobile (393px) - Small Typography
        </h3>
        <div className="max-w-[393px] border-2 border-dashed border-border p-4">
          <HeaderCard
            caption="Mobile"
            title="Smaller Text"
            body="Body text is 16px on mobile for comfortable reading."
            buttonLabel="Full Width Button"
            showRadius={true}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Desktop (868px) - Large Typography
        </h3>
        <div className="max-w-[868px] border-2 border-dashed border-border p-4">
          <HeaderCard
            caption="Desktop"
            title="Larger Text"
            body="Body text scales to 18px on desktop for better readability on larger screens."
            buttonLabel="Fixed Width Button"
            showRadius={true}
          />
        </div>
      </div>
    </div>
  ),
};
