'use client';

import { useState } from 'react';
import { useDeveloperAPIKeys } from '@/hooks/useDeveloperAPIKeys';
import { ApiKeyCard } from '@/components/developer/ApiKeyCard';
import { api } from '@/lib/api-client';
import type { APIKey } from '@/types/resource';

const resourceGroups = [
  { slug: 'quranic-search-api', name: 'Quranic Search API' },
  { slug: 'verse-analytics-api', name: 'Verse Analytics API' },
];

export default function DeveloperAccessPage() {
  const { data: apiKeys, isLoading, mutate } = useDeveloperAPIKeys();
  const [selectedResource, setSelectedResource] = useState<string>('all');

  const handleRevoke = async (keyId: number) => {
    if (!confirm('هل أنت متأكد من إلغاء هذا المفتاح؟')) return;
    await api.developer.apiKeys.revoke(keyId);
    mutate();
  };

  const filteredKeys = selectedResource === 'all'
    ? (apiKeys ?? [])
    : (apiKeys ?? []).filter((k: APIKey) => k.resource_slug === selectedResource);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="skeleton h-4 w-1/3 rounded mb-2" />
            <div className="skeleton h-3 w-2/3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-[var(--text-primary)]">الوصول لدي</h2>
        <span className="text-sm text-[var(--text-muted)]">
          {(apiKeys ?? []).length} مفتاح API
        </span>
      </div>

      {/* Resource filter */}
      <select
        value={selectedResource}
        onChange={(e) => setSelectedResource(e.target.value)}
        className="input-field text-sm py-2 px-3 mb-6 w-64"
      >
        <option value="all">كل الموارد</option>
        {resourceGroups.map((r) => (
          <option key={r.slug} value={r.slug}>{r.name}</option>
        ))}
      </select>

      {/* Create new key form */}
      <div className="card p-4 mb-6">
        <h3 className="font-heading font-semibold text-sm mb-3">إنشاء مفتاح جديد</h3>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="اسم المفتاح"
            className="input-field text-sm py-2 px-3 flex-grow"
          />
          <select className="input-field text-sm py-2 px-3">
            {resourceGroups.map((r) => (
              <option key={r.slug} value={r.slug}>{r.name}</option>
            ))}
          </select>
          <select className="input-field text-sm py-2 px-3">
            <option value="read">قراءة فقط</option>
            <option value="read,write">قراءة وكتابة</option>
          </select>
          <button className="btn-primary text-sm py-2 px-4">إنشاء</button>
        </div>
      </div>

      {/* API Keys list */}
      {filteredKeys.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-[var(--text-muted)]">لا توجد مفاتيح API</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredKeys.map((key: APIKey) => (
            <ApiKeyCard key={key.id} apiKey={key} onRevoke={handleRevoke} />
          ))}
        </div>
      )}
    </div>
  );
}
