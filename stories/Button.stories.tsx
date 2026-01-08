import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'ghost-subtle', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default (Primary) Button Stories
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const DefaultLarge: Story = {
  args: {
    size: 'lg',
    children: 'Button',
  },
};

export const DefaultSmall: Story = {
  args: {
    size: 'sm',
    children: 'Button',
  },
};

export const DefaultWithIcon: Story = {
  args: {
    children: (
      <>
        <Mic />
        Button
      </>
    ),
  },
};

export const DefaultDisabled: Story = {
  args: {
    disabled: true,
    children: 'Button',
  },
};

// Secondary Button Stories
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};

export const SecondaryLarge: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
    children: 'Button',
  },
};

export const SecondaryWithIcon: Story = {
  args: {
    variant: 'secondary',
    children: (
      <>
        <Mic />
        Button
      </>
    ),
  },
};

// Outline Button Stories
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Button',
  },
};

export const OutlineLarge: Story = {
  args: {
    variant: 'outline',
    size: 'lg',
    children: 'Button',
  },
};

export const OutlineWithIcon: Story = {
  args: {
    variant: 'outline',
    children: (
      <>
        <Mic />
        Button
      </>
    ),
  },
};

// Ghost Button Stories
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Button',
  },
};

export const GhostLarge: Story = {
  args: {
    variant: 'ghost',
    size: 'lg',
    children: 'Button',
  },
};

export const GhostWithIcon: Story = {
  args: {
    variant: 'ghost',
    children: (
      <>
        <Mic />
        Button
      </>
    ),
  },
};

// Ghost Subtle Button Stories (for gradient/colored backgrounds)
export const GhostSubtle: Story = {
  args: {
    variant: 'ghost-subtle',
    children: 'Button',
  },
};

export const GhostSubtleLarge: Story = {
  args: {
    variant: 'ghost-subtle',
    size: 'lg',
    children: 'Button',
  },
};

export const GhostSubtleWithIcon: Story = {
  args: {
    variant: 'ghost-subtle',
    children: (
      <>
        <Mic />
        Button
      </>
    ),
  },
};

// Link Button Stories
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Button',
  },
};

// Destructive Button Stories
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Button',
  },
};

export const DestructiveLarge: Story = {
  args: {
    variant: 'destructive',
    size: 'lg',
    children: 'Button',
  },
};

export const DestructiveWithIcon: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <Mic />
        Button
      </>
    ),
  },
};

// Icon Button
export const Icon: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
    children: <Mic />,
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Default</h3>
        <div className="flex gap-4 flex-wrap items-center">
          <Button size="sm">Button</Button>
          <Button>Button</Button>
          <Button size="lg">Button</Button>
          <Button><Mic />Button</Button>
          <Button disabled>Button</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Secondary</h3>
        <div className="flex gap-4 flex-wrap items-center">
          <Button variant="secondary" size="sm">Button</Button>
          <Button variant="secondary">Button</Button>
          <Button variant="secondary" size="lg">Button</Button>
          <Button variant="secondary"><Mic />Button</Button>
          <Button variant="secondary" disabled>Button</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Outline</h3>
        <div className="flex gap-4 flex-wrap items-center">
          <Button variant="outline" size="sm">Button</Button>
          <Button variant="outline">Button</Button>
          <Button variant="outline" size="lg">Button</Button>
          <Button variant="outline"><Mic />Button</Button>
          <Button variant="outline" disabled>Button</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Ghost</h3>
        <div className="flex gap-4 flex-wrap items-center">
          <Button variant="ghost" size="sm">Button</Button>
          <Button variant="ghost">Button</Button>
          <Button variant="ghost" size="lg">Button</Button>
          <Button variant="ghost"><Mic />Button</Button>
          <Button variant="ghost" disabled>Button</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Ghost Subtle (for gradients)</h3>
        <div className="flex gap-4 flex-wrap items-center">
          <Button variant="ghost-subtle" size="sm">Button</Button>
          <Button variant="ghost-subtle">Button</Button>
          <Button variant="ghost-subtle" size="lg">Button</Button>
          <Button variant="ghost-subtle"><Mic />Button</Button>
          <Button variant="ghost-subtle" disabled>Button</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Link</h3>
        <div className="flex gap-4 flex-wrap items-center">
          <Button variant="link" size="sm">Button</Button>
          <Button variant="link">Button</Button>
          <Button variant="link" size="lg">Button</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Destructive</h3>
        <div className="flex gap-4 flex-wrap items-center">
          <Button variant="destructive" size="sm">Button</Button>
          <Button variant="destructive">Button</Button>
          <Button variant="destructive" size="lg">Button</Button>
          <Button variant="destructive"><Mic />Button</Button>
          <Button variant="destructive" disabled>Button</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Icon Buttons</h3>
        <div className="flex gap-4 flex-wrap items-center">
          <Button variant="outline" size="icon"><Mic /></Button>
          <Button variant="ghost" size="icon"><Mic /></Button>
          <Button size="icon"><Mic /></Button>
        </div>
      </div>
    </div>
  ),
};
