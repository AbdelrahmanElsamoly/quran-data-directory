'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api-client';
import type { ReportReason } from '@/types/resource';

export interface UseReportReturn {
  submitReport: (reason: ReportReason, details: string) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function useReport(resourceSlug: string): UseReportReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReport = useCallback(async (reason: ReportReason, details: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.reports.submit(resourceSlug, reason, details);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit report';
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [resourceSlug]);

  return { submitReport, isSubmitting, error };
}
