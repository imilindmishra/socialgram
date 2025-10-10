import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { userEvent, within, expect } from '@storybook/test';
import CreatePostForm from './CreatePostForm';

const meta = {
  title: 'Components/Post/CreatePostForm',
  component: CreatePostForm,
  parameters: {
    layout: 'centered',
  },
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
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const ta = c.getByPlaceholderText(/write a caption/i);
    await userEvent.clear(ta);
    await userEvent.type(ta, 'Hello from play');
    await expect(c.getByDisplayValue('Hello from play')).toBeInTheDocument();
    await userEvent.click(c.getByRole('button', { name: /^post$/i }));
  },
};
