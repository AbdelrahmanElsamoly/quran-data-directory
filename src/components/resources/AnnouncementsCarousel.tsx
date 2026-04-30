'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/i18n';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import type { Announcement, AnnouncementType } from '@/types/announcement';
import type { JSX } from 'react';

const AUTO_ROTATE_MS = 8000;

const typeConfig: Record<AnnouncementType, { labelKey: string; color: string; icon: JSX.Element }> = {
  release: {
    labelKey: 'announcements.types.release',
    color: 'bg-blue-100 text-blue-800',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  new_resource: {
    labelKey: 'announcements.types.new_resource',
    color: 'bg-green-100 text-green-800',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  maintenance: {
    labelKey: 'announcements.types.maintenance',
    color: 'bg-yellow-100 text-yellow-800',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94 1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  breaking_change: {
    labelKey: 'announcements.types.breaking_change',
    color: 'bg-red-100 text-red-800',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
};

function resolveMessage(messages: ReturnType<typeof import('@/i18n').useTranslations>, key: string): string {
  const parts = key.split('.');
  let value: unknown = messages;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
}

function formatRelativeTime(dateStr: string, t: ReturnType<typeof import('@/i18n').useTranslations>): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return t.announcements.ago.replace('{{count}}', `${diffMins}m`);
  if (diffHours < 24) return t.announcements.ago.replace('{{count}}', `${diffHours}h`);
  return t.announcements.ago.replace('{{count}}', `${diffDays}d`);
}

export default function AnnouncementsCarousel() {
  const t = useTranslations();
  const { announcements, isLoading } = useAnnouncements();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slides = announcements;
  const isSingle = slides.length <= 1;

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isPaused && !isSingle && slides.length > 1) {
      timerRef.current = setTimeout(next, AUTO_ROTATE_MS);
    }
  }, [isPaused, isSingle, slides.length, next]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSingle) return;
      if (e.key === 'ArrowLeft') {
        prev();
        setIsPaused(true);
      } else if (e.key === 'ArrowRight') {
        next();
        setIsPaused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next, isSingle]);

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  if (isLoading || slides.length === 0) {
    return null;
  }

  const slide = slides[currentIndex];
  const config = typeConfig[slide.type];

  return (
    <section
      className="section-padding bg-[var(--bg-secondary)]"
      role="region"
      aria-roledescription="carousel"
      aria-label={t.announcements.title}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div
          className={`relative rounded-xl p-6 ${
            slide.type === 'release'
              ? 'bg-blue-50 border border-blue-200'
              : slide.type === 'new_resource'
              ? 'bg-green-50 border border-green-200'
              : slide.type === 'maintenance'
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.icon}
              {resolveMessage(t, config.labelKey)}
            </span>
            <div className="flex-1">
              <h3 className="font-heading text-xl text-[var(--text-primary)] mb-1">{slide.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-2">{slide.description}</p>
              <div className="flex items-center gap-3">
                <time
                  dateTime={slide.created_at}
                  className="text-xs text-[var(--text-muted)]"
                >
                  {formatRelativeTime(slide.created_at, t)}
                </time>
                {slide.cta_url && (
                  <Link
                    href={slide.cta_url}
                    className="text-sm font-medium text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1"
                    role="link"
                  >
                    {slide.cta_label || t.announcements.learnMore}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {!isSingle && (
            <>
              <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button
                  onClick={() => { prev(); setIsPaused(true); }}
                  className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
                  aria-label="Previous announcement"
                >
                  <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                  onClick={() => { next(); setIsPaused(true); }}
                  className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
                  aria-label="Next announcement"
                >
                  <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center gap-1.5 mt-4" role="tablist" aria-label="Announcement slides">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    role="tab"
                    aria-selected={index === currentIndex}
                    aria-label={`Announcement ${index + 1}`}
                    onClick={() => { setCurrentIndex(index); setIsPaused(true); }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentIndex ? 'bg-[var(--accent-primary)] w-6' : 'bg-[var(--text-muted)]/30 hover:bg-[var(--text-muted)]/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
