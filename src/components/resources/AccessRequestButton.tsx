'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { useTranslations } from '@/i18n';

interface AccessRequestButtonProps {
  resourceSlug: string;
  resourceName: string;
}

export function AccessRequestButton({ resourceSlug, resourceName }: AccessRequestButtonProps) {
  const { user } = useAuth();
  const t = useTranslations();
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await api.requests.submit(resourceSlug, message);
      setSubmitted(true);
      setMessage('');
    } catch (err) {
      setError(t.resource.detail.requestFailed);
    }
  };

  if (!user) {
    return (
      <Link href="/login" className="btn-outline block text-center text-sm py-2.5 px-4">
        {t.resource.detail.loginToRequest}
      </Link>
    );
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-sm text-green-800 font-semibold">{t.resource.detail.requestSent}</p>
        <p className="text-xs text-green-600 mt-1">{t.resource.detail.requestReviewed}</p>
      </div>
    );
  }

  return (
    <>
      {!showModal ? (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn-primary block text-center text-sm py-2.5 px-4 w-full"
        >
          {t.resource.detail.accessRequest}
        </button>
      ) : (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-sm">{t.resource.detail.accessRequestFor} {resourceName}</h3>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg leading-none"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder={t.resource.detail.accessReason}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field w-full min-h-[80px] resize-y text-sm mb-3"
              required
            />
            {error && <p className="text-xs text-[var(--danger)] mb-2">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-xs py-2 px-4 flex-grow">
                {t.resource.detail.submit}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-secondary text-xs py-2 px-4"
              >
                {t.resource.detail.cancel}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
