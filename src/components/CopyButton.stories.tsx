import type { Meta, StoryObj } from '@storybook/react';
import { CopyButton } from './CopyButton';

const meta: Meta<typeof CopyButton> = {
    title: 'UI/CopyButton',
    component: CopyButton,
    tags: ['autodocs'],
    parameters: {
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#111114' }],
        },
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Кнопка для копіювання тексту в буфер обміну. Відображається при наведенні (`group-hover`). Після копіювання показує іконку Check на 2 секунди, потім повертається до стану Copy.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div className="relative group p-8 rounded-lg bg-zinc-900 border border-zinc-700 min-w-[200px] min-h-[80px] flex items-center justify-center">
                <code className="text-zinc-300 text-sm">npm install react</code>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        text: {
            control: 'text',
            description: 'Текст, який буде скопійовано в буфер обміну',
        },
    },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
    args: {
        text: 'npm install react',
    },
};

export const Copied: Story = {
    args: {
        text: 'npm install react',
    },
    decorators: [
        (Story) => (
            <div className="relative p-8 rounded-lg bg-zinc-900 border border-zinc-700 min-w-[200px] min-h-[80px] flex items-center justify-center">
                <code className="text-zinc-300 text-sm">npm install react</code>
                {/* Імітуємо copied=true через override стилю */}
                <div className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
            </div>
        ),
    ],
};

export const LongText: Story = {
    args: {
        text: 'const result = await fetch("https://api.example.com/v1/software?page=1&perPage=10");',
    },
    decorators: [
        (Story) => (
            <div className="relative group p-8 rounded-lg bg-zinc-900 border border-zinc-700 min-w-[400px] min-h-[80px] flex items-center justify-center">
                <code className="text-zinc-300 text-sm truncate max-w-[320px]">
                    const result = await fetch(&quot;https://api.example.com/v1/software&quot;);
                </code>
                <Story />
            </div>
        ),
    ],
};
