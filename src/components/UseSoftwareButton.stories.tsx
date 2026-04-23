import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import UseSoftwareButton from './UseSoftwareButton';

const meta: Meta<typeof UseSoftwareButton> = {
    title: 'UI/UseSoftwareButton',
    component: UseSoftwareButton,
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
                    'Кнопка для позначення програмного забезпечення як використовуваного. ' +
                    'Має три візуальні стани: `unused` (сіра, "+ I used this"), ' +
                    '`used` (світла, "✓ Used") та `loading` (спінер під час запиту до API). ' +
                    'При кліку викликає API і оновлює роутер.',
            },
        },
    },
    argTypes: {
        softwareId: {
            control: 'number',
            description: 'ID програмного забезпечення',
        },
        initialIsUsed: {
            control: 'boolean',
            description: 'Початковий стан — чи використовує поточний користувач це ПЗ',
        },
    },
};

export default meta;
type Story = StoryObj<typeof UseSoftwareButton>;

export const Default: Story = {
    args: {
        softwareId: 1,
        initialIsUsed: false,
    },
};

export const Used: Story = {
    args: {
        softwareId: 1,
        initialIsUsed: true,
    },
};

export const Loading: Story = {
    args: {
        softwareId: 1,
        initialIsUsed: false,
    },
    parameters: {
        docs: {
            description: {
                story:
                    'Щоб побачити цей стан — натисніть кнопку. ' +
                    'Стан `loading` активний під час виконання запиту до API.',
            },
        },
    },
};

export const Disabled: Story = {
    args: {
        softwareId: 1,
        initialIsUsed: false,
    },
    render: (args) => (
        <button
            disabled
            className="flex items-center gap-2 h-11 sm:h-12 px-4 rounded-xl border transition-all duration-300 font-medium text-sm shrink-0 bg-zinc-900/80 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>I used this</span>
        </button>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Відображення кнопки для неавторизованих користувачів — заблокована і напівпрозора.',
            },
        },
    },
};
