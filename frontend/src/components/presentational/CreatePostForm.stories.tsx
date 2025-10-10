import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import CreatePostForm from './CreatePostForm';

const meta = {
  title: 'Components/Post/CreatePostForm',
  component: CreatePostForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Presentational form for creating a post. Handles caption, image file selection, preview, and submit action via callbacks.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    caption: { control: 'text', description: 'Caption value' },
    onCaptionChange: { action: 'change-caption', description: 'Called when caption changes' },
    onFileChange: { action: 'change-file', description: 'Called when a file is selected' },
    preview: { control: 'text', description: 'Preview image URL' },
    error: { control: 'text', description: 'Error message text' },
    submitting: { control: 'boolean', description: 'Submission loading state' },
    onSubmit: { action: 'submit', description: 'Called when user submits the form' },
  },
} satisfies Meta<typeof CreatePostForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [caption, setCaption] = useState('A beautiful day!');
    const [preview, setPreview] = useState<string | null>('https://picsum.photos/seed/form/800/500');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    return (
      <div className="w-[420px]">
        <CreatePostForm
          caption={caption}
          onCaptionChange={setCaption}
          preview={preview}
          error={error}
          submitting={submitting}
          onFileChange={(f) => setPreview(f ? URL.createObjectURL(f) : null)}
          onSubmit={() => {
            setSubmitting(true);
            setTimeout(() => {
              setSubmitting(false);
              setError('Example error: something went wrong');
            }, 800);
          }}
        />
      </div>
    );
  },
};

export const Submitting: Story = {
  args: {
    caption: 'Uploading now…',
    preview: 'https://picsum.photos/seed/form/800/500',
    submitting: true,
    error: null,
  },
};

export const WithError: Story = {
  args: {
    caption: 'Oops',
    preview: 'https://picsum.photos/seed/form/800/500',
    submitting: false,
    error: 'Failed to upload image',
  },
};
