# Versioning & GitHub Stats Feature Design

**Date:** 2026-04-27  
**Status:** Approved

## Overview

Add two features to the resource marketplace:
1. **Versioning** — Display resource version on cards and detail pages
2. **GitHub Stats** — Show stars, forks, open issues, and last commit on detail pages for GitHub-published resources

## Design Decisions

- **Version source:** Backend API field (`version` on Resource model)
- **GitHub stats source:** Backend proxies GitHub API, caches stats in `github_stats` field
- **Version placement:** Footer area of resource cards; Metadata section on detail page
- **GitHub stats placement:** New dedicated section on detail page, only when `github_url` exists

## Data Model

### New Fields on `Resource`

```typescript
interface Resource {
  // ... existing fields ...
  version: string | null;           // e.g., "v2.4.1"
  github_stats: GithubStats | null; // cached from GitHub API
}

interface GithubStats {
  stars: number;
  forks: number;
  open_issues: number;
  last_commit: string;              // ISO 8601 date string
}
```

### Backend Responsibilities (out of scope for frontend PR)

- Add `version` field to Resource model
- Periodically fetch GitHub stats for resources with `github_url`
- Cache stats to avoid rate limits (management command or Celery task)
- Include `github_stats` in API response

## Frontend Changes

### 1. Type Definitions (`src/types/resource.ts`)

Add `GithubStats` interface and extend `Resource` with `version` and `github_stats` fields.

### 2. Resource Card (`src/components/resources/ResourceCard.tsx`)

Add version badge in footer area:
- Displayed between license and GitHub link
- Only shown when `resource.version` is non-null
- Uses existing badge styling pattern

```tsx
{resource.version && (
  <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded">
    {resource.version}
  </span>
)}
```

### 3. Resource Detail Page (`src/app/resources/[slug]/ResourceDetailClient.tsx`)

#### Version in Metadata Section
Add version row to the existing metadata grid alongside license, type, created/updated dates.

#### GitHub Stats Section
New component rendered when `resource.github_url` exists:
- Positioned after Metadata section, before Comments
- 4 stat cards in a 2x2 grid: Stars, Forks, Open Issues, Last Commit
- Header with "View on GitHub" link
- Fallback state when `github_stats` is null (repo deleted/private): "Stats unavailable" message with repo link

### 4. New Component: `GithubStatsCard.tsx`

```tsx
interface GithubStatsCardProps {
  githubUrl: string;
  stats: GithubStats | null;
}

export function GithubStatsCard({ githubUrl, stats }: GithubStatsCardProps) {
  // Pure presentation component
  // Shows 2x2 grid of stats or "Stats unavailable" fallback
}
```

Component characteristics:
- No state or data fetching
- Uses existing card/container styling (`bg-[var(--bg-card)]`, `border-[var(--border-color)]`)
- Icons for each stat (star, fork, issue clock)
- Follows project's Tailwind CSS patterns

### 5. Mock Data (`src/lib/mock-data.ts`)

Add `version` and `github_stats` to mock resources for development/testing.

### 6. i18n Translations

Add to `src/i18n/messages/ar.ts` and `en.ts`:

```typescript
{
  resource: {
    // ...
    version: 'Version',
    github: {
      stats: 'GitHub Statistics',
      stars: 'Stars',
      forks: 'Forks',
      openIssues: 'Open Issues',
      lastCommit: 'Last Commit',
      viewOnGithub: 'View on GitHub',
      statsUnavailable: 'Stats unavailable',
    }
  }
}
```

## Error Handling

| Scenario | Behavior |
|----------|----------|
| `version` is null | Version badge hidden on card and detail |
| `github_url` is null | GithubStatsCard not rendered |
| `github_url` exists but `github_stats` is null | Show "Stats unavailable" with repo link |
| GitHub API fails (backend) | Backend returns null, frontend shows fallback |

## Testing

- Verify version displays correctly on cards when present/absent
- Verify version shows in metadata section on detail page
- Verify GithubStatsCard shows stats when available
- Verify fallback state when stats unavailable
- Verify component hides when no GitHub URL
- Test with mock data in both API modes

## Out of Scope

- Version history/changelog feature
- Real-time GitHub stats refresh from frontend
- Backend implementation of GitHub sync
- Private repo authentication
