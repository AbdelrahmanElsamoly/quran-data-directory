'use client';

import { useState } from 'react';
import { useComments } from '@/hooks/useResources';
import { formatDate } from '@/lib/utils';
import { useLanguage } from '@/i18n';

interface CommentSectionProps {
  resourceId: number;
}

export function CommentSection({ resourceId }: CommentSectionProps) {
  const { data: comments, isLoading } = useComments(resourceId);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const { t, locale } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Stub: comments.create() not yet available in api-client.ts
    // For now, just clear the form and show a message
    setNewComment('');
    setAuthorName('');
  };

  return (
    <section className="mt-10 border-t border-[var(--border-color)] pt-8">
      <h2 className="font-heading text-xl font-semibold mb-6">{t.resource.detail.comments}</h2>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-3">
          <input
            type="text"
            placeholder={t.resource.detail.authorName}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="input-field w-full mb-3"
            required
          />
          <textarea
            placeholder={t.resource.detail.leaveAComment}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="input-field w-full min-h-[100px] resize-y"
            required
          />
        </div>
        <button type="submit" className="btn-primary text-sm py-2 px-5">
          {t.resource.detail.post}
        </button>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          {t.resource.detail.commingSoon}
        </p>
      </form>

      {/* Comment list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-lg" />
          ))}
        </div>
      ) : !comments || comments.length === 0 ? (
        <p className="text-[var(--text-muted)] text-center py-6">{t.resource.detail.noComments}</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-[var(--text-primary)]">
                  {comment.author_name}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {formatDate(comment.created_at, locale)}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
