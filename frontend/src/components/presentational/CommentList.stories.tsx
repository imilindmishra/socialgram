import type { Meta, StoryObj } from '@storybook/react';
import CommentList from './CommentList';

const meta = {
  title: 'Components/Post/CommentList',
  component: CommentList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Presentational list of comments with avatar, name, timestamp, and text.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    comments: { control: false, description: 'Array of comments to render' },
  },
} satisfies Meta<typeof CommentList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { comments: [] } };

export const WithComments: Story = {
  args: {
    comments: [
      { user: { name: 'Grace Hopper' }, text: 'Great post!', createdAt: new Date().toISOString() },
      { user: { name: 'Alan Turing' }, text: 'Inspiring 👏', createdAt: new Date().toISOString() },
    ] as any,
  },
};
