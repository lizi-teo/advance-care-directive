import type { Meta, StoryObj } from '@storybook/react';
import { AppBar } from '@/components/ui/app-bar';

const meta = {
  title: 'UI/AppBar',
  component: AppBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['back', 'progression', 'login', 'close'],
      description: 'The variant type of the app bar',
    },
    size: {
      control: 'select',
      options: ['small', 'large'],
      description: 'Size of the app bar (small: 56px, large: 80px)',
    },
    progressText: {
      control: 'text',
      description: 'Progress indicator text (progression variant)',
    },
    nextText: {
      control: 'text',
      description: 'Next step text (progression variant)',
    },
    brandText: {
      control: 'text',
      description: 'Brand/app name text (login/close variants)',
    },
    avatarLabel: {
      control: 'text',
      description: 'Avatar letter/label (close variant)',
    },
  },
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Back Variant Stories
export const BackSmall: Story = {
  args: {
    type: 'back',
    size: 'small',
    onBack: () => console.log('Back clicked'),
  },
};

export const BackLarge: Story = {
  args: {
    type: 'back',
    size: 'large',
    onBack: () => console.log('Back clicked'),
  },
};

// Progression Variant Stories
export const ProgressionSmall: Story = {
  args: {
    type: 'progression',
    size: 'small',
    progressText: '1 of 3',
    nextText: 'Next: Connection',
    onFontSize: () => console.log('Font size clicked'),
    onClose: () => console.log('Close clicked'),
  },
};

export const ProgressionLarge: Story = {
  args: {
    type: 'progression',
    size: 'large',
    progressText: '1 of 3',
    nextText: 'Next: Connection',
    onFontSize: () => console.log('Font size clicked'),
    onClose: () => console.log('Close clicked'),
  },
};

export const ProgressionStep2: Story = {
  args: {
    type: 'progression',
    size: 'small',
    progressText: '2 of 3',
    nextText: 'Next: Values',
    onFontSize: () => console.log('Font size clicked'),
    onClose: () => console.log('Close clicked'),
  },
};

export const ProgressionStep3: Story = {
  args: {
    type: 'progression',
    size: 'small',
    progressText: '3 of 3',
    nextText: 'Next: Review',
    onFontSize: () => console.log('Font size clicked'),
    onClose: () => console.log('Close clicked'),
  },
};

// Login Variant Stories
export const LoginSmall: Story = {
  args: {
    type: 'login',
    size: 'small',
    brandText: 'AU ACD',
    onMenu: () => console.log('Menu clicked'),
    onLogin: () => console.log('Login clicked'),
    onGetStarted: () => console.log('Get started clicked'),
  },
};

export const LoginLarge: Story = {
  args: {
    type: 'login',
    size: 'large',
    brandText: 'AU ACD',
    onMenu: () => console.log('Menu clicked'),
    onLogin: () => console.log('Login clicked'),
    onGetStarted: () => console.log('Get started clicked'),
  },
};

// Close Variant Stories
export const CloseSmall: Story = {
  args: {
    type: 'close',
    size: 'small',
    brandText: 'AU ACD',
    avatarLabel: 'L',
    onMenu: () => console.log('Menu clicked'),
  },
};

export const CloseLarge: Story = {
  args: {
    type: 'close',
    size: 'large',
    brandText: 'AU ACD',
    avatarLabel: 'L',
    onMenu: () => console.log('Menu clicked'),
  },
};

export const CloseWithDifferentAvatar: Story = {
  args: {
    type: 'close',
    size: 'small',
    brandText: 'AU ACD',
    avatarLabel: 'J',
    onMenu: () => console.log('Menu clicked'),
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 bg-background min-h-screen p-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Back Variant</h3>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Small (56px)</p>
            <AppBar type="back" size="small" onBack={() => console.log('Back')} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Large (80px)</p>
            <AppBar type="back" size="large" onBack={() => console.log('Back')} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Progression Variant</h3>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Small (56px) - Step 1</p>
            <AppBar
              type="progression"
              size="small"
              progressText="1 of 3"
              nextText="Next: Connection"
              onFontSize={() => console.log('Font size')}
              onClose={() => console.log('Close')}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Large (80px) - Step 1</p>
            <AppBar
              type="progression"
              size="large"
              progressText="1 of 3"
              nextText="Next: Connection"
              onFontSize={() => console.log('Font size')}
              onClose={() => console.log('Close')}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Small - Step 2</p>
            <AppBar
              type="progression"
              size="small"
              progressText="2 of 3"
              nextText="Next: Values"
              onFontSize={() => console.log('Font size')}
              onClose={() => console.log('Close')}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Login Variant</h3>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Small (56px)</p>
            <AppBar
              type="login"
              size="small"
              brandText="AU ACD"
              onMenu={() => console.log('Menu')}
              onLogin={() => console.log('Login')}
              onGetStarted={() => console.log('Get started')}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Large (80px)</p>
            <AppBar
              type="login"
              size="large"
              brandText="AU ACD"
              onMenu={() => console.log('Menu')}
              onLogin={() => console.log('Login')}
              onGetStarted={() => console.log('Get started')}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Close Variant (Logged In)</h3>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Small (56px)</p>
            <AppBar
              type="close"
              size="small"
              brandText="AU ACD"
              avatarLabel="L"
              onMenu={() => console.log('Menu')}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Large (80px)</p>
            <AppBar
              type="close"
              size="large"
              brandText="AU ACD"
              avatarLabel="L"
              onMenu={() => console.log('Menu')}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Different User (J)</p>
            <AppBar
              type="close"
              size="small"
              brandText="AU ACD"
              avatarLabel="J"
              onMenu={() => console.log('Menu')}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
