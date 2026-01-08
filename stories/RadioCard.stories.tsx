import type { Meta, StoryObj } from '@storybook/react';
import { RadioCardGroup, RadioCard } from '@/components/ui/radio-card';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'UI/RadioCard',
  component: RadioCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'large'],
      description: 'Size variant (small: 20px padding, large: 32px padding)',
    },
    layout: {
      control: 'select',
      options: ['stacked', 'inline'],
      description: 'Layout variant (stacked: title + description, inline: single line)',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default - Small size with stacked layout (most common use case)
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <RadioCardGroup value={value} onValueChange={setValue}>
        <RadioCard
          value="option1"
          size="small"
          title="Label"
          description="Label"
        />
        <RadioCard
          value="option2"
          size="small"
          title="Label"
          description="Label"
        />
        <RadioCard
          value="option3"
          size="small"
          title="Label"
          description="Label"
        />
      </RadioCardGroup>
    );
  },
};

// Small size with stacked layout (title + description)
export const SmallStacked: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <RadioCardGroup value={value} onValueChange={setValue}>
        <RadioCard
          value="option1"
          size="small"
          title="Label"
          description="Label"
        />
        <RadioCard
          value="option2"
          size="small"
          title="Label"
          description="Label"
        />
        <RadioCard
          value="option3"
          size="small"
          title="Label"
          description="Label"
        />
      </RadioCardGroup>
    );
  },
};

// Large size with stacked layout (title + description)
export const LargeStacked: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <RadioCardGroup value={value} onValueChange={setValue}>
        <RadioCard
          value="option1"
          size="large"
          title="Label"
          description="Label"
        />
        <RadioCard
          value="option2"
          size="large"
          title="Label"
          description="Label"
        />
        <RadioCard
          value="option3"
          size="large"
          title="Label"
          description="Label"
        />
      </RadioCardGroup>
    );
  },
};

// Small size with inline layout (single label)
export const SmallInline: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <RadioCardGroup value={value} onValueChange={setValue}>
        <RadioCard value="option1" size="small" layout="inline">
          <p className="text-base">Label</p>
        </RadioCard>
        <RadioCard value="option2" size="small" layout="inline">
          <p className="text-base">Label</p>
        </RadioCard>
        <RadioCard value="option3" size="small" layout="inline">
          <p className="text-base">Label</p>
        </RadioCard>
      </RadioCardGroup>
    );
  },
};

// Large size with inline layout (single label)
export const LargeInline: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <RadioCardGroup value={value} onValueChange={setValue}>
        <RadioCard value="option1" size="large" layout="inline">
          <p className="text-lg leading-normal">Label</p>
        </RadioCard>
        <RadioCard value="option2" size="large" layout="inline">
          <p className="text-lg leading-normal">Label</p>
        </RadioCard>
        <RadioCard value="option3" size="large" layout="inline">
          <p className="text-lg leading-normal">Label</p>
        </RadioCard>
      </RadioCardGroup>
    );
  },
};

// Real-world example: Payment methods
export const PaymentMethods: Story = {
  render: () => {
    const [value, setValue] = useState('card');
    return (
      <RadioCardGroup value={value} onValueChange={setValue}>
        <RadioCard
          value="card"
          size="small"
          title="Credit Card"
          description="Pay with credit or debit card"
          icon={<CreditCard className="h-6 w-6 text-primary" />}
        />
        <RadioCard
          value="mobile"
          size="small"
          title="Mobile Payment"
          description="Pay with your mobile wallet"
          icon={<Smartphone className="h-6 w-6 text-primary" />}
        />
        <RadioCard
          value="wallet"
          size="small"
          title="Digital Wallet"
          description="Pay with your digital wallet"
          icon={<Wallet className="h-6 w-6 text-primary" />}
        />
      </RadioCardGroup>
    );
  },
};

// Real-world example: Question with answers
export const QuestionAnswers: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          What matters most to you in your care?
        </h3>
        <RadioCardGroup value={value} onValueChange={setValue}>
          <RadioCard
            value="comfort"
            size="small"
            title="Comfort and pain management"
            description="Prioritizing physical comfort and minimizing pain"
          />
          <RadioCard
            value="independence"
            size="small"
            title="Maintaining independence"
            description="Preserving ability to make decisions and care for myself"
          />
          <RadioCard
            value="family"
            size="small"
            title="Being with family"
            description="Spending quality time with loved ones"
          />
          <RadioCard
            value="dignity"
            size="small"
            title="Maintaining dignity"
            description="Preserving sense of self and personal values"
          />
        </RadioCardGroup>
      </div>
    );
  },
};

// Disabled state
export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <RadioCardGroup value={value} onValueChange={setValue}>
        <RadioCard
          value="option1"
          size="small"
          title="Available Option"
          description="This option can be selected"
        />
        <RadioCard
          value="option2"
          size="small"
          title="Disabled Option"
          description="This option is disabled"
          disabled
        />
        <RadioCard
          value="option3"
          size="small"
          title="Another Available Option"
          description="This option can also be selected"
        />
      </RadioCardGroup>
    );
  },
};

// All States Showcase
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Small Size - Stacked</h3>
        <RadioCardGroup defaultValue="option2">
          <RadioCard
            value="option1"
            size="small"
            title="Label"
            description="Label"
          />
          <RadioCard
            value="option2"
            size="small"
            title="Label"
            description="Label"
          />
        </RadioCardGroup>
      </div>

      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Large Size - Stacked</h3>
        <RadioCardGroup defaultValue="option2">
          <RadioCard
            value="option1"
            size="large"
            title="Label"
            description="Label"
          />
          <RadioCard
            value="option2"
            size="large"
            title="Label"
            description="Label"
          />
        </RadioCardGroup>
      </div>

      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Small Size - Inline</h3>
        <RadioCardGroup defaultValue="option2">
          <RadioCard value="option1" size="small" layout="inline">
            <p className="text-base">Label</p>
          </RadioCard>
          <RadioCard value="option2" size="small" layout="inline">
            <p className="text-base">Label</p>
          </RadioCard>
        </RadioCardGroup>
      </div>

      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Large Size - Inline</h3>
        <RadioCardGroup defaultValue="option2">
          <RadioCard value="option1" size="large" layout="inline">
            <p className="text-lg leading-normal">Label</p>
          </RadioCard>
          <RadioCard value="option2" size="large" layout="inline">
            <p className="text-lg leading-normal">Label</p>
          </RadioCard>
        </RadioCardGroup>
      </div>
    </div>
  ),
};
