import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import PostCardView from './PostCardView';
import { userEvent, within, expect, fn } from '@storybook/test';
// Component-level story only; interactions are controlled via args.

const meta = {
  title: 'Components/Post/PostCardView',
  component: PostCardView,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    liked: {
      control: 'boolean',
      description: 'Whether the current user has liked the post',
      table: { defaultValue: { summary: false } },
    },
    likeCount: {
      control: 'number',
      description: 'Displayed like count',
    },
    showComments: {
      control: 'boolean',
      description: 'Toggle visibility of the comments section',
      table: { defaultValue: { summary: false } },
    },
    onToggleLike: { action: 'toggle-like', description: 'Invoked when like button is clicked' },
    onToggleComments: { action: 'toggle-comments', description: 'Invoked when comments toggle is clicked' },
    onSubmitComment: { action: 'submit-comment', description: 'Invoked when comment form is submitted' },
    commentText: { control: 'text', description: 'Current value of the comment input' },
    onCommentTextChange: { action: 'change-comment-text', description: 'Invoked on comment input change' },
    post: { control: false, description: 'Post data object' },
  },
  args: {
    liked: false,
    showComments: false,
    likeCount: 0,
    commentText: '',
    onToggleLike: fn(),
    onToggleComments: fn(),
    onSubmitComment: fn(),
    onCommentTextChange: fn(),
  },
} satisfies Meta<typeof PostCardView>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePost = {
  _id: 'p1',
  author: { name: 'Ada Lovelace', profilePicture: '' },
  caption: 'Hello from Storybook! 🌟',
  imageUrl: 'https://picsum.photos/seed/post/900/600',
  likes: [],
  comments: [],
  createdAt: new Date().toISOString(),
};

export const Playground: Story = {
  args: {
    post: samplePost as any,
    likeCount: 0,
    showComments: true,
  },
  render: (args) => (
    <div className="w-[420px]">
      <PostCardView {...args} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await expect(c.getByText((args.post as any).caption)).toBeInTheDocument();
    // Like clicked
    await userEvent.click(c.getByRole('button', { name: /like/i }));
    expect(args.onToggleLike).toHaveBeenCalled();
    // Toggle comments
    const commentsBtn = c.getByRole('button', { name: /comments/i });
    await userEvent.click(commentsBtn);
    expect(args.onToggleComments).toHaveBeenCalled();
    // Comment change + submit (handlers fire)
    const input = c.getByPlaceholderText(/add a comment/i);
    await userEvent.type(input, 'Nice!');
    expect(args.onCommentTextChange).toHaveBeenCalled();
    await userEvent.click(c.getByRole('button', { name: /^post$/i }));
    expect(args.onSubmitComment).toHaveBeenCalled();
  },
};

// Single component-level story. Use controls to toggle liked/showComments,
// adjust likeCount, and edit commentText.
