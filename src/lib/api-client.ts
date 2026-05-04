// ─── API Client ────────────────────────────────────────────────────────────
// Abstract data layer: mock mode (default) or real mode (Django backend)
// Switch via NEXT_PUBLIC_DATA_MODE env var
// ───────────────────────────────────────────────────────────────────────────

import type {
  Resource,
  Comment,
  AccessRequest,
  Report,
  ReportReason,
  APIKey,
  User,
  PaginatedResponse,
  ResourceListParams,
  RequestStatus,
  NotificationItem,
} from '@/types/resource';
import type { Announcement, TrendingResource } from '@/types/announcement';

import {
  mockResources,
  mockComments,
  mockPaginated,
  mockAnnouncements,
  mockDeveloperResources,
  mockDeveloperAPIKeys,
  mockDeveloperNotifications,
} from './mock-data';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const DATA_MODE = process.env.NEXT_PUBLIC_DATA_MODE || 'mock';

// ─── Resource Endpoints ───────────────────────────────────────────────────

async function fetchResources(
  params: ResourceListParams = {}
): Promise<PaginatedResponse<Resource>> {
  if (DATA_MODE === 'mock') {
    // Apply filters
    let filtered = [...mockResources];

    if (params.type) {
      filtered = filtered.filter((r) => r.type === params.type);
    }
    if (params.license) {
      filtered = filtered.filter((r) => r.license === params.license);
    }
    if (params.itqan_badge === 'true') {
      filtered = filtered.filter((r) => r.itqan_badge);
    }
    if (params.itqan_badge === 'false') {
      filtered = filtered.filter((r) => !r.itqan_badge);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    // Apply sorting
    if (params.sort) {
      switch (params.sort) {
        case 'downloads':
          filtered.sort((a, b) => b.total_downloads - a.total_downloads);
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          break;
        case 'name_asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        // 'relevance' is default - no sorting needed
      }
    }

    const page = params.page || 1;
    const pageSize = params.page_size || 12;
    return mockPaginated(filtered, pageSize, page);
  }

  const qs = new URLSearchParams();
  if (params.type) qs.set('type', params.type);
  if (params.license) qs.set('license', params.license);
  if (params.itqan_badge !== undefined) qs.set('itqan_badge', params.itqan_badge);
  if (params.search) qs.set('search', params.search);
  if (params.sort) qs.set('sort', params.sort);
  if (params.page) qs.set('page', String(params.page));
  if (params.page_size) qs.set('page_size', String(params.page_size));

  const res = await fetch(`${API_BASE}/api/v1/resources/?${qs}`);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
}

async function fetchResource(slug: string): Promise<Resource> {
  if (DATA_MODE === 'mock') {
    const resource = mockResources.find((r) => r.slug === slug);
    if (!resource) throw new Error('Resource not found');
    return resource;
  }

  const res = await fetch(`${API_BASE}/api/v1/resources/${slug}/`);
  if (!res.ok) throw new Error('Resource not found');
  return res.json();
}

// ─── Comment Endpoints ────────────────────────────────────────────────────

async function fetchComments(resourceId: number): Promise<Comment[]> {
  if (DATA_MODE === 'mock') {
    return mockComments[resourceId] || [];
  }

  const res = await fetch(`${API_BASE}/api/v1/resources/${resourceId}/comments/`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

// ─── Auth Endpoints ───────────────────────────────────────────────────────

async function login(email: string, password: string) {
  if (DATA_MODE === 'mock') {
    // Mock: always succeeds with a fake user
    return {
      access: 'mock-jwt-access-token',
      refresh: 'mock-jwt-refresh-token',
      user: {
        id: 1,
        email,
        display_name: email.split('@')[0],
        role: 'developer',
      } as User,
    };
  }

  const res = await fetch(`${API_BASE}/api/v1/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

async function register(
  email: string,
  password: string,
  display_name: string,
  role: 'developer' | 'publisher' = 'developer'
) {
  if (DATA_MODE === 'mock') {
    return {
      access: 'mock-jwt-access-token',
      refresh: 'mock-jwt-refresh-token',
      user: {
        id: 2,
        email,
        display_name,
        role,
      } as User,
    };
  }

  const res = await fetch(`${API_BASE}/api/v1/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, display_name, role }),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

// ─── Access Request Endpoints ─────────────────────────────────────────────

async function submitAccessRequest(
  resourceSlug: string,
  message: string
) {
  if (DATA_MODE === 'mock') {
    return {
      id: Date.now(),
      status: 'pending',
      message,
    } as AccessRequest;
  }

  const res = await fetch(`${API_BASE}/api/v1/access-requests/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ resource: resourceSlug, message }),
  });
  if (!res.ok) throw new Error('Failed to submit request');
  return res.json();
}

async function fetchMyRequests(): Promise<AccessRequest[]> {
  if (DATA_MODE === 'mock') {
    return [
      {
        id: 101,
        applicant_name: 'John D.',
        applicant_display_name: 'John D.',
        resource_slug: 'quranic-text-toolkit',
        resource_name: 'Quranic Text Toolkit (QTT)',
        status: 'pending',
        message: 'I need this for my research project on Quranic NLP.',
        publisher_notes: null,
        created_at: '2026-03-20T10:00:00Z',
        updated_at: '2026-03-20T10:00:00Z',
      },
    ];
  }

  const res = await fetch(`${API_BASE}/api/v1/access-requests/`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
}

// ─── API Key Endpoints ────────────────────────────────────────────────────

async function generateApiKey(resourceSlug: string): Promise<APIKey> {
  if (DATA_MODE === 'mock') {
    return {
      id: Date.now(),
      name: `key-for-${resourceSlug}`,
      resource_slug: resourceSlug,
      resource_name: '',
      key: `ratq_live_${Math.random().toString(36).substring(2, 18)}`,
      scope: 'read',
      created_at: new Date().toISOString(),
      last_used_at: null,
    };
  }

  const res = await fetch(`${API_BASE}/api/v1/api-keys/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ resource: resourceSlug }),
  });
  if (!res.ok) throw new Error('Failed to generate key');
  return res.json();
}

// ─── Report Endpoint ──────────────────────────────────────────────────────

async function submitReport(
  resourceSlug: string,
  reason: ReportReason,
  details: string
) {
  if (DATA_MODE === 'mock') {
    return {
      id: Date.now(),
      status: 'open',
      resource_slug: resourceSlug,
    };
  }

  const res = await fetch(`${API_BASE}/api/v1/reports/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ resource: resourceSlug, reason, details }),
  });
  if (!res.ok) throw new Error('Failed to submit report');
  return res.json();
}

// ─── Auth Helpers ─────────────────────────────────────────────────────────

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ratq_access_token');
}

function setAuthTokens(access: string, refresh: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ratq_access_token', access);
  localStorage.setItem('ratq_refresh_token', refresh);
}

function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ratq_access_token');
  localStorage.removeItem('ratq_refresh_token');
}

// ─── Announcement Endpoints ──────────────────────────────────────────────

function fetchAnnouncements(): Promise<Announcement[]> {
  if (DATA_MODE === 'mock') {
    const now = new Date();
    return Promise.resolve(
      mockAnnouncements.filter((a) => {
        if (!a.is_active) return false;
        if (a.expires_at && new Date(a.expires_at) < now) return false;
        return true;
      })
    );
  }

  return fetch(`${API_BASE}/api/announcements/`).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  });
}

// ─── Trending Resource Endpoints ─────────────────────────────────────────

function fetchTrendingResources(period: '7d' | '30d' | 'all-time'): Promise<TrendingResource[]> {
  if (DATA_MODE === 'mock') {
    const isAllTime = period === 'all-time';
    const sorted = [...mockResources]
      .filter((r) => (isAllTime ? r.total_downloads > 0 : r.downloads > 0))
      .sort((a, b) => (isAllTime ? b.total_downloads - a.total_downloads : b.downloads - a.downloads))
      .slice(0, 3)
      .map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        type: r.type,
        description: r.description,
        version: r.version,
        license: r.license,
        downloads: isAllTime ? r.total_downloads : r.downloads,
      }));
    return Promise.resolve(sorted);
  }

  const qs = new URLSearchParams({ period, limit: '3' });
  return fetch(`${API_BASE}/api/resources/trending/?${qs}`).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch trending resources');
    return res.json();
  });
}

// ─── Developer Resource Endpoints ─────────────────────────────────────────

async function fetchDeveloperResources(userId: number): Promise<Resource[]> {
  if (DATA_MODE === 'mock') {
    return mockDeveloperResources;
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/resources/`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch developer resources');
  return res.json();
}

async function deleteDeveloperResource(resourceSlug: string) {
  if (DATA_MODE === 'mock') {
    return { success: true };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/resources/${resourceSlug}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete resource');
  return res.json();
}

// ─── Developer API Key Endpoints ──────────────────────────────────────────

async function fetchDeveloperAPIKeys(): Promise<APIKey[]> {
  if (DATA_MODE === 'mock') {
    return mockDeveloperAPIKeys;
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/api-keys/`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch API keys');
  return res.json();
}

async function createDeveloperApiKey(resourceSlug: string, scope: string): Promise<APIKey> {
  if (DATA_MODE === 'mock') {
    return {
      id: Date.now(),
      name: `key-${resourceSlug}`,
      resource_slug: resourceSlug,
      resource_name: '',
      key: `ratq_live_${Math.random().toString(36).substring(2, 18)}`,
      scope,
      created_at: new Date().toISOString(),
      last_used_at: null,
    };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/api-keys/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ resource: resourceSlug, scope }),
  });
  if (!res.ok) throw new Error('Failed to create API key');
  return res.json();
}

async function revokeDeveloperApiKey(keyId: number) {
  if (DATA_MODE === 'mock') {
    return { success: true };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/api-keys/${keyId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to revoke API key');
  return res.json();
}

// ─── Developer Notifications Endpoints ──────────────────────────────────────

async function fetchDeveloperNotifications(): Promise<NotificationItem[]> {
  if (DATA_MODE === 'mock') {
    return mockDeveloperNotifications;
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/notifications/`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

async function markNotificationAsRead(notificationId: number) {
  if (DATA_MODE === 'mock') {
    return { success: true };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/notifications/${notificationId}/read/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
  return res.json();
}

async function markAllNotificationsAsRead() {
  if (DATA_MODE === 'mock') {
    return { success: true };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/notifications/read-all/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to mark all notifications as read');
  return res.json();
}

// ─── Developer Access Management Endpoints ────────────────────────────────

async function inviteDeveloperByEmail(resourceSlug: string, email: string, scope: string) {
  if (DATA_MODE === 'mock') {
    return {
      id: Date.now(),
      email,
      resource_slug: resourceSlug,
      key: `ratq_live_${Math.random().toString(36).substring(2, 18)}`,
      scope,
    };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/resources/${resourceSlug}/invite/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ email, scope }),
  });
  if (!res.ok) throw new Error('Failed to send invite');
  return res.json();
}

async function revokeDeveloperAccess(resourceSlug: string, userEmail: string) {
  if (DATA_MODE === 'mock') {
    return { success: true };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/resources/${resourceSlug}/access/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ email: userEmail }),
  });
  if (!res.ok) throw new Error('Failed to revoke access');
  return res.json();
}

// ─── Export ───────────────────────────────────────────────────────────────

export const api = {
  resources: { list: fetchResources, detail: fetchResource },
  comments: { list: fetchComments },
  auth: { login, register },
  requests: { submit: submitAccessRequest, myRequests: fetchMyRequests },
  apiKeys: { generate: generateApiKey },
  reports: { submit: submitReport },
  authHelpers: { getAccessToken, setAuthTokens, clearAuth },
  announcements: { list: fetchAnnouncements },
  trending: { list: fetchTrendingResources },
  // Developer endpoints
  developer: {
    resources: { list: fetchDeveloperResources, delete: deleteDeveloperResource },
    apiKeys: {
      list: fetchDeveloperAPIKeys,
      create: createDeveloperApiKey,
      revoke: revokeDeveloperApiKey,
    },
    notifications: {
      list: fetchDeveloperNotifications,
      markRead: markNotificationAsRead,
      markAllRead: markAllNotificationsAsRead,
    },
    access: {
      inviteByEmail: inviteDeveloperByEmail,
      revoke: revokeDeveloperAccess,
    },
  },
};

export { DATA_MODE };
