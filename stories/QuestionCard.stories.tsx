import type { Meta, StoryObj } from '@storybook/react';
import { QuestionCard } from '@/components/ui/question-card';

const meta = {
  title: 'UI/QuestionCard',
  component: QuestionCard,
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
    size: {
      control: 'select',
      options: ['small', 'large'],
      description: 'Card size variant',
    },
    showImage: {
      control: 'boolean',
      description: 'Show image placeholder (only for small size)',
    },
    onPlayClick: {
      action: 'play clicked',
      description: 'Callback when play button is clicked',
    },
    onLearnMoreClick: {
      action: 'learn more clicked',
      description: 'Callback when "Tell me more" is clicked',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof QuestionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default - Small size
export const Default: Story = {
  args: {
    caption: 'Question 1',
    title: 'What matters most to you in healthcare?',
    size: 'small',
    showImage: false,
  },
};

// Small with Caption
export const SmallWithCaption: Story = {
  args: {
    caption: 'Step 1 of 5',
    title: 'Understanding Your Values',
    size: 'small',
    showImage: false,
  },
};

// Small without Caption
export const SmallWithoutCaption: Story = {
  args: {
    title: 'Your Healthcare Preferences',
    size: 'small',
    showImage: false,
  },
};

// Small with Image
export const SmallWithImage: Story = {
  args: {
    caption: 'Introduction',
    title: 'Watch to Learn More',
    size: 'small',
    showImage: true,
  },
};

// Large size
export const Large: Story = {
  args: {
    caption: 'Question 1',
    title: 'What matters most to you in healthcare?',
    size: 'large',
    showImage: false,
  },
};

// Large with Caption
export const LargeWithCaption: Story = {
  args: {
    caption: 'Important Decision',
    title: 'Consider Your Treatment Preferences',
    size: 'large',
    showImage: false,
  },
};

// Large without Caption
export const LargeWithoutCaption: Story = {
  args: {
    title: 'Your Healthcare Journey',
    size: 'large',
    showImage: false,
  },
};

// Long Title - Small
export const LongTitleSmall: Story = {
  args: {
    caption: 'Question 3',
    title: 'If you were seriously ill, what would be most important to you in making decisions about your care?',
    size: 'small',
    showImage: false,
  },
};

// Long Title - Large
export const LongTitleLarge: Story = {
  args: {
    caption: 'Question 3',
    title: 'If you were seriously ill, what would be most important to you in making decisions about your care?',
    size: 'large',
    showImage: false,
  },
};

// Mobile Preview (393px max-width)
export const MobilePreview: Story = {
  args: {
    caption: 'Mobile View',
    title: 'Optimized for Small Screens',
    size: 'small',
    showImage: false,
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
    size: 'large',
    showImage: false,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[868px] p-8 bg-background">
        <Story />
      </div>
    ),
  ],
};

// Real-world Example: Video Introduction
export const VideoIntroductionExample: Story = {
  args: {
    caption: 'Introduction',
    title: 'Understanding Advance Care Directives',
    size: 'small',
    showImage: true,
  },
};

// Real-world Example: Question Prompt
export const QuestionPromptExample: Story = {
  args: {
    caption: 'Question 2',
    title: 'Who would you want to make healthcare decisions for you if you could not?',
    size: 'large',
    showImage: false,
  },
};

// Real-world Example: Topic Introduction
export const TopicIntroductionExample: Story = {
  args: {
    caption: 'Chapter 1',
    title: 'Your Healthcare Values and Priorities',
    size: 'small',
    showImage: false,
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-12 max-w-[900px]">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Small - Without Image (393px)
        </h3>
        <div className="max-w-[393px]">
          <QuestionCard
            caption="Question 1"
            title="What is most important to you?"
            size="small"
            showImage={false}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Small - With Image (393px)
        </h3>
        <div className="max-w-[393px]">
          <QuestionCard
            caption="Introduction"
            title="Watch to Learn More"
            size="small"
            showImage={true}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Large (868px)
        </h3>
        <div className="max-w-[868px]">
          <QuestionCard
            caption="Question 2"
            title="Who would you want to make decisions for you?"
            size="large"
            showImage={false}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Without Caption
        </h3>
        <div className="max-w-[393px]">
          <QuestionCard
            title="Your Healthcare Preferences"
            size="small"
            showImage={false}
          />
        </div>
      </div>
    </div>
  ),
};

// Size Comparison
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Small (393px) - 30px Title on Mobile, 36px on Desktop
        </h3>
        <div className="max-w-[393px] border-2 border-dashed border-border p-4">
          <QuestionCard
            caption="Small Size"
            title="Smaller Title Text"
            size="small"
            showImage={false}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Large (868px) - 36px Title Consistently
        </h3>
        <div className="max-w-[868px] border-2 border-dashed border-border p-4">
          <QuestionCard
            caption="Large Size"
            title="Larger Title Text"
            size="large"
            showImage={false}
          />
        </div>
      </div>
    </div>
  ),
};

// Gradient Showcase (Light and Dark)
export const GradientShowcase: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Light Mode Gradients
        </h3>
        <div className="space-y-6">
          <div className="max-w-[393px]">
            <QuestionCard
              caption="Small Light"
              title="Light Gradient Background"
              size="small"
              showImage={false}
            />
          </div>
          <div className="max-w-[868px]">
            <QuestionCard
              caption="Large Light"
              title="Light Gradient Background"
              size="large"
              showImage={false}
            />
          </div>
        </div>
      </div>

      <div className="dark">
        <div className="p-6 bg-background rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Dark Mode Gradients
          </h3>
          <div className="space-y-6">
            <div className="max-w-[393px]">
              <QuestionCard
                caption="Small Dark"
                title="Dark Gradient Background"
                size="small"
                showImage={false}
              />
            </div>
            <div className="max-w-[868px]">
              <QuestionCard
                caption="Large Dark"
                title="Dark Gradient Background"
                size="large"
                showImage={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Interactive Example
export const InteractiveExample: Story = {
  render: () => {
    const handlePlayClick = () => {
      alert('Play button clicked! Video would start here.');
    };

    const handleLearnMoreClick = () => {
      alert('Learn more clicked! Additional info would appear here.');
    };

    return (
      <div className="max-w-[393px]">
        <QuestionCard
          caption="Interactive"
          title="Click the Play or Learn More Buttons"
          size="small"
          showImage={true}
          onPlayClick={handlePlayClick}
          onLearnMoreClick={handleLearnMoreClick}
        />
      </div>
    );
  },
};
