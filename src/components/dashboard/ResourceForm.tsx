'use client';

import { useState } from 'react';
import type { ResourceType } from '@/types/resource';

interface ResourceFormProps {
  onSubmit: (data: {
    name: string;
    type: ResourceType;
    short_description: string;
    description: string;
    license: string;
    itqan_badge: boolean;
    github_url: string;
    documentation_url: string;
  }) => void;
  initial?: {
    name?: string;
    type?: ResourceType;
    short_description?: string;
    description?: string;
    license?: string;
    itqan_badge?: boolean;
    github_url?: string;
    documentation_url?: string;
  };
  submitLabel?: string;
}

export function ResourceForm({ onSubmit, initial, submitLabel = 'Save Resource' }: ResourceFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [type, setType] = useState<ResourceType>(initial?.type || 'library');
  const [shortDescription, setShortDescription] = useState(initial?.short_description || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [license, setLicense] = useState(initial?.license || '');
  const [itqan_badge, setItqanBadge] = useState(initial?.itqan_badge || false);
  const [github_url, setGithubUrl] = useState(initial?.github_url || '');
  const [documentation_url, setDocumentationUrl] = useState(initial?.documentation_url || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, type, short_description: shortDescription, description, license, itqan_badge, github_url, documentation_url });
  };

  const resourceTypes: { value: ResourceType; label: string }[] = [
    { value: 'library', label: 'Library' },
    { value: 'sdk', label: 'SDK' },
    { value: 'dataset', label: 'Dataset' },
    { value: 'api', label: 'API' },
    { value: 'tafsir', label: 'Tafsir' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-heading text-[var(--text-secondary)] mb-1">
          Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          required
          placeholder="Resource name"
        />
      </div>

      <div>
        <label className="block text-sm font-heading text-[var(--text-secondary)] mb-1">
          Type *
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ResourceType)}
          className="input-field"
        >
          {resourceTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-heading text-[var(--text-secondary)] mb-1">
          Short Description *
        </label>
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="input-field"
          required
          placeholder="Brief one-line summary shown in listings"
          maxLength={160}
        />
      </div>

      <div>
        <label className="block text-sm font-heading text-[var(--text-secondary)] mb-1">
          Full Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field min-h-[100px] resize-y"
          required
          placeholder="Detailed description shown on the resource detail page…"
        />
      </div>

      <div>
        <label className="block text-sm font-heading text-[var(--text-secondary)] mb-1">
          License
        </label>
        <input
          type="text"
          value={license}
          onChange={(e) => setLicense(e.target.value)}
          className="input-field"
          placeholder="e.g. MIT, GPL-3.0, custom"
        />
      </div>

      <div>
        <label className="block text-sm font-heading text-[var(--text-secondary)] mb-1">
          GitHub URL
        </label>
        <input
          type="url"
          value={github_url}
          onChange={(e) => setGithubUrl(e.target.value)}
          className="input-field"
          placeholder="https://github.com/…"
        />
      </div>

      <div>
        <label className="block text-sm font-heading text-[var(--text-secondary)] mb-1">
          Documentation URL
        </label>
        <input
          type="url"
          value={documentation_url}
          onChange={(e) => setDocumentationUrl(e.target.value)}
          className="input-field"
          placeholder="https://docs.example.com/…"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="itqan-badge"
          checked={itqan_badge}
          onChange={(e) => setItqanBadge(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <label htmlFor="itqan-badge" className="text-sm text-[var(--text-secondary)]">
          Itqan Verified Badge
        </label>
      </div>

      <button type="submit" className="btn-primary w-full">{submitLabel}</button>
    </form>
  );
}
