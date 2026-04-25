'use client';

import type { AccessRequest } from '@/types/resource';

interface RequestCardProps {
  request: AccessRequest;
  onApprove?: (id: number) => void;
  onDeny?: (id: number) => void;
}

const statusStyles: Record<AccessRequest['status'], { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending' },
  approved: { bg: 'bg-green-50', text: 'text-green-700', label: 'Approved' },
  denied: { bg: 'bg-red-50', text: 'text-red-700', label: 'Denied' },
};

export function RequestCard({ request, onApprove, onDeny }: RequestCardProps) {
  const style = statusStyles[request.status];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`p-4 rounded-xl border ${style.bg} border-[var(--border-color)]`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading font-semibold text-sm">{request.resource_name}</span>
            <span className={`badge ${style.bg} ${style.text}`}>{style.label}</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mb-2">
            Requested by {request.applicant_display_name} · {formatDate(request.created_at)}
          </p>
          <p className="text-sm text-[var(--text-secondary)] bg-white/60 rounded-lg p-3">
            {request.message}
          </p>
          {request.publisher_notes && (
            <p className="text-sm mt-2 italic text-[var(--text-muted)]">
              Notes: {request.publisher_notes}
            </p>
          )}
        </div>

        {request.status === 'pending' && onApprove && onDeny && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onApprove(request.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-heading font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onDeny(request.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-heading font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Deny
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
