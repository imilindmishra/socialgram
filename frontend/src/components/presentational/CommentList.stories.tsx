import type { Meta, StoryObj } from '@storybook/react';
import CommentList from './CommentList';
import { within, expect } from '@storybook/test';

const meta = {
  title: 'Components/Post/CommentList',
  component: CommentList,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    comments: { control: 'object', description: 'Array of comments to render' },
  },
} satisfies Meta<typeof CommentList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    comments: [
      { user: { name: 'Grace Hopper' }, text: 'Great post!', createdAt: new Date().toISOString() },
      { user: { name: 'Alan Turing' }, text: 'Inspiring 👏', createdAt: new Date().toISOString() },
    ] as any,
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText('Great post!')).toBeInTheDocument();
    await expect(c.getByText('Inspiring 👏')).toBeInTheDocument();
  },
};
