import React from 'react';

type UserMini = { name: string; profilePicture?: string };
type Comment = { user: UserMini | string; text: string; createdAt: string };

export function CommentList({ comments }: { comments: Comment[] }) {
  return (
    <div className="flex flex-col gap-2">
      {comments?.length ? (
        comments.map((c, i) => (
          <div key={i} className="flex items-start gap-2">
            <img
              src={typeof c.user === 'string' ? `https://ui-avatars.com/api/?name=?` : (c.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user.name)}`)}
              alt={typeof c.user === 'string' ? 'User' : c.user.name}
              className="w-6 h-6 rounded-full object-cover mt-0.5"
            />
            <div>
              <div className="text-xs text-gray-600">
                {typeof c.user === 'string' ? 'User' : c.user.name} • {new Date(c.createdAt).toLocaleString()}
              </div>
              <div className="text-sm">{c.text}</div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No comments yet.</p>
      )}
    </div>
  );
}

export default CommentList;

