import React from 'react';

export function CommentForm({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex gap-2"
    >
      <input
        className="flex-1 border rounded px-2 py-1 text-sm"
        placeholder="Add a comment…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={500}
        disabled={disabled}
      />
      <button disabled={disabled} className="text-sm bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50">
        Post
      </button>
    </form>
  );
}

export default CommentForm;

