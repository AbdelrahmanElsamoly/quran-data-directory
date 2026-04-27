// ─── Resource Types ───────────────────────────────────────────────────────

export type ResourceType = 'library' | 'sdk' | 'dataset' | 'api' | 'tafsir' | 'audio' | 'pdf' | 'json';

export type ResourceStatus = 'draft' | 'published' | 'archived';

export interface Resource {
  id: number;
  name: string;
  slug: string;
  type: ResourceType;
  description: string;
  documentation_url: string | null;
  github_url: string | null;
  license: string;
  itqan_badge: boolean;
  status: ResourceStatus;
  created_at: string;
  updated_at: string;
  version: string | null;
  github_stats: GithubStats | null;

  // Preview fields (filled by publishers, auto-fetched as fallback)
  api_endpoint?: string | null;
  api_docs?: string | null;
  api_test_url?: string | null;
  sdk_install_command?: string | null;
  sdk_examples?: string | null;
  dataset_sample_data?: string | null;
  dataset_stats?: string | null;
  audio_url?: string | null;
  audio_thumbnail?: string | null;
  pdf_url?: string | null;
  pdf_excerpt?: string | null;
  json_content?: string | null;
}

export interface GithubStats {
  stars: number;
  forks: number;
  open_issues: number;
  last_commit: string;  // ISO 8601
}

// ─── Comment Types ────────────────────────────────────────────────────────

export interface Comment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
}

// ─── Access Request Types ─────────────────────────────────────────────────

export type RequestStatus = 'pending' | 'approved' | 'denied';

export interface AccessRequest {
  id: number;
  applicant_name: string;
  applicant_display_name: string;
  resource_slug: string;
  resource_name: string;
  status: RequestStatus;
  message: string;
  publisher_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Report Types ─────────────────────────────────────────────────────────

export type ReportReason = 'inaccurate' | 'inappropriate' | 'infringing' | 'spam' | 'outdated' | 'broken-link';

export type ReportStatus = 'open' | 'resolved' | 'closed';

export interface Report {
  id: number;
  reporter_name: string;
  resource_slug: string;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  created_at: string;
}

// ─── API Key Types ────────────────────────────────────────────────────────

export interface APIKey {
  id: number;
  name: string;
  resource_slug: string;
  resource_name: string;
  key: string;
  scope: string;
  created_at: string;
  last_used_at: string | null;
}

// ─── User Types ───────────────────────────────────────────────────────────

export type UserRole = 'developer' | 'publisher' | 'admin';

export interface User {
  id: number;
  email: string;
  display_name: string;
  role: UserRole;
  created_at: string;
}

// ─── API Response Types ───────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ResourceListParams {
  type?: string;
  license?: string;
  itqan_badge?: string;
  search?: string;
  page?: number;
  page_size?: number;
}
