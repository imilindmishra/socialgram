import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import PostCardView from './PostCardView';
import { expect, userEvent, within } from '@storybook/test';

const meta = {
  title: 'Components/Post/PostCardView',
  component: PostCardView,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Presentational post card showing image, caption, likes, and comments. No app logic; interactions surfaced via callbacks.',
      },
    },
  },
  tags: ['autodocs'],
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
  },
  render: (args) => (
    <div className="w-[420px]">
      <PostCardView {...args} />
    </div>
  ),
};

export const Liked: Story = {
  args: {
    post: samplePost as any,
    liked: true,
    likeCount: 12,
  },
};

export const WithComments: Story = {
  args: {
    post: {
      ...samplePost,
      comments: [
        { user: { name: 'Grace Hopper' }, text: 'Brilliant!', createdAt: new Date().toISOString() },
        { user: { name: 'Alan Turing' }, text: 'Nice work!', createdAt: new Date().toISOString() },
      ],
    } as any,
    showComments: true,
    likeCount: 2,
  },
};

export const InteractiveDemo: Story = {
  render: (args) => {
    const [liked, setLiked] = React.useState(args.liked ?? false);
    const [likeCount, setLikeCount] = React.useState(args.likeCount ?? 0);
    const [showComments, setShowComments] = React.useState(false);
    const [commentText, setCommentText] = React.useState('');
    const [post, setPost] = React.useState({ ...(args.post as any), comments: [] });

    return (
      <div className="w-[420px]">
        <PostCardView
          {...args}
          post={post as any}
          liked={liked}
          likeCount={likeCount}
          showComments={showComments}
          onToggleLike={() => {
            setLiked((v) => {
              const nv = !v;
              setLikeCount((c) => c + (nv ? 1 : -1));
              return nv;
            });
          }}
          onToggleComments={() => setShowComments((s) => !s)}
          commentText={commentText}
          onCommentTextChange={setCommentText}
          onSubmitComment={() => {
            if (!commentText.trim()) return;
            setPost((p: any) => ({
              ...p,
              comments: [
                ...p.comments,
                { user: { name: 'You' }, text: commentText, createdAt: new Date().toISOString() },
              ],
            }));
            setCommentText('');
          }}
        />
      </div>
    );
  },
  args: {
    post: {
      _id: 'p1',
      author: { name: 'Ada Lovelace', profilePicture: '' },
      caption: 'Hello from Storybook! 🌟',
      imageUrl: 'https://picsum.photos/seed/post/900/600',
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    } as any,
    liked: false,
    likeCount: 0,
    showComments: false,
    commentText: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /like/i }));
    await expect(canvas.getByText(/1 likes/)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /view comments/i }));
    const input = await canvas.findByPlaceholderText(/add a comment/i);
    await userEvent.type(input, 'Nice!');
    await userEvent.click(canvas.getByRole('button', { name: /post/i }));
    await expect(canvas.getByText('Nice!')).toBeInTheDocument();
    await expect(input).toHaveValue('');
  },
};
