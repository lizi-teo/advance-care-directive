import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

const meta = {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    step: { control: { type: 'number' } },
    disabled: { control: 'boolean' },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: [40],
  },
};

export const Beginning: Story = {
  args: {
    defaultValue: [0],
  },
};

export const End: Story = {
  args: {
    defaultValue: [100],
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: [40],
    disabled: true,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState([40]);
    return (
      <div className="flex flex-col gap-4">
        <Slider
          {...args}
          value={value}
          onValueChange={setValue}
        />
        <p className="text-primary-foreground text-sm text-center tabular-nums">
          {value[0]}%
        </p>
      </div>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-64">
      <div className="flex flex-col gap-2">
        <p className="text-primary-foreground/70 text-xs uppercase tracking-wide">0%</p>
        <Slider defaultValue={[0]} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-primary-foreground/70 text-xs uppercase tracking-wide">25%</p>
        <Slider defaultValue={[25]} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-primary-foreground/70 text-xs uppercase tracking-wide">50%</p>
        <Slider defaultValue={[50]} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-primary-foreground/70 text-xs uppercase tracking-wide">75%</p>
        <Slider defaultValue={[75]} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-primary-foreground/70 text-xs uppercase tracking-wide">100%</p>
        <Slider defaultValue={[100]} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-primary-foreground/70 text-xs uppercase tracking-wide">Disabled</p>
        <Slider defaultValue={[40]} disabled />
      </div>
    </div>
  ),
};
