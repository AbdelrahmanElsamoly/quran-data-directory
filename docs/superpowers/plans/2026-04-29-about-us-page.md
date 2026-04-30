# About Us Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (Arabic/English) About Us page for the RATQ Community Platform with five core sections in a problem-to-solution narrative flow.

**Architecture:** A single client-component page at `src/app/about/page.tsx` using the existing React Context i18n system. Content is organized into five visually distinct sections with alternating background tones. The "What We Offer" section uses a card grid layout. All content flows through i18n message files for full bilingual support.

**Tech Stack:** Next.js App Router, React (client component), Tailwind CSS with CSS custom properties, project's existing `useTranslations()` hook

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/i18n/messages/index.ts` | Add `about` section to `Messages` interface |
| Modify | `src/i18n/messages/en.ts` | Add English content for all 5 sections |
| Modify | `src/i18n/messages/ar.ts` | Add Arabic content for all 5 sections |
| Create | `src/app/about/page.tsx` | Page component with all 5 content sections |
| Modify | `src/components/layout/Header.tsx` | Wire About nav link to `/about` route |
| Modify | `src/components/layout/Footer.tsx` | Wire About community link to `/about` route |

---

### Task 1: Add About Us messages to the Messages interface

**Files:**
- Modify: `src/i18n/messages/index.ts`

- [ ] **Step 1: Add the `about` section to the `Messages` interface**

Add the following interface block inside the `Messages` interface (after the `pagination` block, before the `import` statements):

```typescript
  about: {
    pageTitle: string;
    why: {
      paragraph1: string;
      paragraph2: string;
    };
    whatIs: {
      paragraph1: string;
      paragraph2Before: string;
      paragraph2After: string;
      standards: string;
    };
    offer: {
      title: string;
      items: {
        catalog: { title: string; description: string };
        verification: { title: string; description: string };
        access: { title: string; description: string };
        community: { title: string; description: string };
        tools: { title: string; description: string };
      };
    };
    mission: {
      title: string;
      description: string;
    };
    vision: {
      title: string;
      description: string;
    };
  };
```

- [ ] **Step 2: Verify the interface compiles**

Run: `npx tsc --noEmit`
Expected: No new type errors introduced (existing errors are pre-existing)

- [ ] **Step 3: Commit**

```bash
git add src/i18n/messages/index.ts
git commit -m "feat(i18n): add about page message interface"
```

---

### Task 2: Add English content for About Us page

**Files:**
- Modify: `src/i18n/messages/en.ts`

- [ ] **Step 1: Add the English `about` section**

Add the following block to the English messages object (after the `pagination` block):

```typescript
  about: {
    pageTitle: 'About Us',
    why: {
      paragraph1: 'For too long, developers building Quranic software have faced the same struggle — resources scattered across GitHub, personal blogs, and academic portals. No way to verify accuracy. No trusted standard. Publishers with valuable, copyright-protected content had no professional way to manage access or track usage.',
      paragraph2: 'We are developers, scholars, and publishers who lived this frustration every day. So we built a home for our community — a place where discovery is simple, quality is verified, and collaboration is the norm. This platform is not just a directory. It is the foundation of how we build, share, and grow together.',
    },
    whatIs: {
      paragraph1: 'RATQ is a community-driven hub for discovering, distributing, and governing Quranic development assets. It is a shared space where developers find verified libraries, SDKs, datasets, and APIs — and publishers share their resources with the community.',
      paragraph2Before: 'Every resource on the platform is reviewed against the ',
      paragraph2After: ', ensuring accuracy, completeness, and proper attribution. Whether you\'re building a Quranic app, researching translations, or publishing a tafsir dataset, RATQ is where our community comes together to build with trust.',
      standards: '**Itqan Standards**',
    },
    offer: {
      title: 'What We Offer',
      items: {
        catalog: {
          title: 'A Curated Resource Catalog',
          description: 'Browse libraries, SDKs, datasets, APIs, tafsir references, and translations, all organized and searchable in one place.',
        },
        verification: {
          title: 'Itqan Standards Verification',
          description: 'Resources earning the Itqan badge have been reviewed by our community for accuracy, completeness, and proper attribution. You can trust what you build on.',
        },
        access: {
          title: 'Access Management for Publishers',
          description: 'Share restricted or copyright-protected resources with a structured workflow. Manage access requests, track usage, and maintain control over your content.',
        },
        community: {
          title: 'Community Engagement',
          description: 'Rate resources, leave comments, and report issues. The platform grows stronger with every contribution from our community.',
        },
        tools: {
          title: 'Developer Tools',
          description: 'Secure API keys, version tracking, and integration webhooks to streamline your workflow from discovery to deployment.',
        },
      },
    },
    mission: {
      title: 'Our Mission',
      description: 'To empower developers and publishers with a secure, curated, and community-governed space for Quranic development resources — where quality is verified, access is streamlined, and collaboration thrives.',
    },
    vision: {
      title: 'Our Vision',
      description: 'To become the global standard for trust, accuracy, and collaboration in Quranic software development — a place every developer turns to first, and every publisher calls home.',
    },
  },
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit`
Expected: No type errors in `en.ts`

- [ ] **Step 3: Commit**

```bash
git add src/i18n/messages/en.ts
git commit -m "feat(i18n): add English content for about page"
```

---

### Task 3: Add Arabic content for About Us page

**Files:**
- Modify: `src/i18n/messages/ar.ts`

- [ ] **Step 1: Add the Arabic `about` section**

Add the following block to the Arabic messages object (after the `pagination` block):

```typescript
  about: {
    pageTitle: 'حولنا',
    why: {
      paragraph1: 'طويلاً، واجه المطورون الذين يعملون على برمجيات قرآنية نفس التحدي — موارد مبعثرة بين منصات متعددة، بدون وسيلة للتحقق من دقتها أو موثوقيتها. والناشرون الذين يمتلكون محتوى قيّمًا محميًا بحقوق النشر لم يجدوا قناة مهنية لإدارته أو توزيعه.',
      paragraph2: 'نحن مطورون ودارسون وناشرون عشنا هذا التحدي من الداخل. فقررنا أن نبني بيتًا لمجتمعنا — مكانًا تتقاطع فيه الدقة مع الثقة، ويصبح التعاون أسلوب عمل وليس خيارًا. هذه المنصة ليست مجرد دليل، بل هي أساس كيف نبني ونشارك وننمو معًا.',
    },
    whatIs: {
      paragraph1: 'منصة RATQ هي مركز مجتمعي لاكتشاف وتوزيع وإدارة الموارد التطويرية القرآنية. فضاء مشترك يجتمع فيه المطورون للعثور على مكتبات وأدوات وبيانات موثقة، ويشارك فيه الناشرون مواردهم مع المجتمع.',
      paragraph2Before: 'كل مورد على المنصة يُراجع وفق ',
      paragraph2After: '، لضمان الدقة والاكتمال والنسبة الصحيحة لمصدره. سواء كنت تبني تطبيقًا قرآنيًا، أو تبحث في الترجمات، أو تنشر مجموعة بيانات تفسيرية — منصة RATQ هي حيث يجتمع مجتمعنا للبناء معًا وبثقة.',
      standards: '**معايير إتقان**',
    },
    offer: {
      title: 'ماذا نقدم',
      items: {
        catalog: {
          title: 'دليل موارد مختار بعناية',
          description: 'تصفح المكتبات وأدوات التطوير ومجموعات البيانات والواجهات البرمجية والمراجع التفسيرية والترجمات، كل شيء منظم وقابل للبحث في مكان واحد.',
        },
        verification: {
          title: 'التحقق وفق معايير إتقان',
          description: 'الموارد الحاملة لشعار إتقان تمت مراجعتها من قبل مجتمعنا من حيث الدقة والاكتمال والنسبة الصحيحة لمصدرها. ابنِ بثقة على ما تثق به.',
        },
        access: {
          title: 'إدارة الوصول للناشرين',
          description: 'شارك الموارد المحمية أو المقيدة عبر سير عمل منظم. أدر طلبات الوصول، تابع الاستخدام، واحفظ السيطرة على محتواك.',
        },
        community: {
          title: 'تفاعل مجتمعي',
          description: 'قيّم الموارد، اترك تعليقات، وأبلغ عن أي مشكلات. المنصة تنمو وتتقوى مع كل مساهمة من مجتمعنا.',
        },
        tools: {
          title: 'أدوات المطورين',
          description: 'مفاتيح API آمنة، تتبع الإصدارات، وتنبيهات التكامل لتبسيط سير عملك من الاكتشاف إلى النشر.',
        },
      },
    },
    mission: {
      title: 'مهمتنا',
      description: 'أن نمكّن المطورين والناشرين عبر فضاء آمن ومختار ومُدار مجتمعيًا للموارد التطويرية القرآنية — حيث تُتحقق الجودة، ويُبسّط الوصول، وينمو التعاون.',
    },
    vision: {
      title: 'رؤيتنا',
      description: 'أن نكون المعيار العالمي للثقة والدقة والتعاون في التطوير البرمجي القرآني — المكان الأول الذي يلجأ إليه كل مطور، والمنزل الذي يعود إليه كل ناشر.',
    },
  },
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit`
Expected: No type errors in `ar.ts`

- [ ] **Step 3: Commit**

```bash
git add src/i18n/messages/ar.ts
git commit -m "feat(i18n): add Arabic content for about page"
```

---

### Task 4: Create the About Us page component

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Write the page component**

Create `src/app/about/page.tsx` with the following content:

```tsx
'use client';

import { useTranslations } from '@/i18n';

export default function AboutPage() {
  const t = useTranslations();

  return (
    <main>
      {/* Section 1: Why We Built It (Narrative Intro) */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 via-[var(--bg-primary)] to-[var(--gold)]/10" />
        <div className="section-padding pt-16 pb-16 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-snug mb-8">
              {t.about.pageTitle}
            </h1>
            <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed text-balance">
              <p>{t.about.why.paragraph1}</p>
              <p>{t.about.why.paragraph2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: What is RATQ */}
      <section className="section-padding py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6">
            RATQ
          </h2>
          <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed text-balance">
            <p>{t.about.whatIs.paragraph1}</p>
            <p>
              {t.about.whatIs.paragraph2Before}
              <strong className="text-[var(--accent-primary)]">{t.about.whatIs.standards}</strong>
              {t.about.whatIs.paragraph2After}
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: What We Offer */}
      <section className="section-padding py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-10 text-center">
            {t.about.offer.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Curated Catalog */}
            <div className="card rounded-xl p-6 bg-[var(--bg-card)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
                {t.about.offer.items.catalog.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {t.about.offer.items.catalog.description}
              </p>
            </div>

            {/* Itqan Verification */}
            <div className="card rounded-xl p-6 bg-[var(--bg-card)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
                {t.about.offer.items.verification.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {t.about.offer.items.verification.description}
              </p>
            </div>

            {/* Access Management */}
            <div className="card rounded-xl p-6 bg-[var(--bg-card)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
                {t.about.offer.items.access.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {t.about.offer.items.access.description}
              </p>
            </div>

            {/* Community Engagement */}
            <div className="card rounded-xl p-6 bg-[var(--bg-card)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
                {t.about.offer.items.community.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {t.about.offer.items.community.description}
              </p>
            </div>

            {/* Developer Tools */}
            <div className="card rounded-xl p-6 bg-[var(--bg-card)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
                {t.about.offer.items.tools.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {t.about.offer.items.tools.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Our Mission */}
      <section className="section-padding py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6">
            {t.about.mission.title}
          </h2>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed text-balance">
            {t.about.mission.description}
          </p>
        </div>
      </section>

      {/* Section 5: Our Vision */}
      <section className="section-padding py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6">
            {t.about.vision.title}
          </h2>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed text-balance">
            {t.about.vision.description}
          </p>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Verify the page compiles and renders**

Run: `npm run build`
Expected: Build succeeds without errors

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: implement about us page with five content sections"
```

---

### Task 5: Wire About link in Header navigation

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Change desktop About link from `href="#"` to `href="/about"`**

Replace the desktop nav's About link:

```tsx
// Before:
<a href="#" className="text-sm font-heading text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
  {t.header.nav.about}
</a>

// After:
<Link href="/about" className="text-sm font-heading text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
  {t.header.nav.about}
</Link>
```

- [ ] **Step 2: Change mobile About link from `href="#"` to `href="/about"`**

Replace the mobile nav's About link:

```tsx
// Before:
<a href="#" className="block text-sm font-heading text-[var(--text-secondary)] hover:text-[var(--accent-primary)]">
  {t.header.nav.about}
</a>

// After:
<Link href="/about" className="block text-sm font-heading text-[var(--text-secondary)] hover:text-[var(--accent-primary)]">
  {t.header.nav.about}
</Link>
```

- [ ] **Step 3: Verify the component compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "fix: wire about nav link to /about route in header"
```

---

### Task 6: Wire About link in Footer

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Change the About Us footer link from `href="#"` to `href="/about"`**

Replace the community About link:

```tsx
// Before:
<a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
  {t.footer.community.about}
</a>

// After:
<Link href="/about" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
  {t.footer.community.about}
</Link>
```

- [ ] **Step 2: Verify the component compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "fix: wire about footer link to /about route"
```

---

### Task 7: Final verification

**Files:** All modified files

- [ ] **Step 1: Run the full build**

Run: `npm run build`
Expected: Build completes successfully with no errors

- [ ] **Step 2: Run linting**

Run: `npm run lint`
Expected: No new lint errors introduced

- [ ] **Step 3: Verify the page renders in dev mode**

Run: `npm run dev` (background), then visit `http://localhost:3000/about`
Expected:
- Page renders with all 5 sections visible
- Arabic is the default language (RTL layout)
- Switching to English changes all text and flips to LTR
- Alternating background tones separate sections
- "What We Offer" displays as a responsive card grid
- Header and Footer links navigate to the page

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete about us page implementation"
```
(or skip if no remaining changes)

---

## Self-Review

### Spec Coverage

| Spec Requirement | Task | Status |
|------------------|------|--------|
| Section 1: Why We Built It (narrative intro, visually distinct) | Task 4 | ✅ Wider max-width, gradient background, prominent typography |
| Section 2: What is RATQ | Task 4 | ✅ Alternating background, "Itqan Standards" highlighted |
| Section 3: What We Offer (card/grid layout) | Task 4 | ✅ 3-column responsive card grid with icons |
| Section 4: Our Mission | Task 4 | ✅ Centered, alternating background |
| Section 5: Our Vision | Task 4 | ✅ Centered, clean layout |
| Bilingual (AR/EN) content | Task 2, Task 3 | ✅ Full content in both languages |
| i18n message files integration | Task 1-3 | ✅ Interface + EN + AR |
| Alternating background tones | Task 4 | ✅ `bg-[var(--bg-secondary)]` on even sections |
| Community-focused language (no "marketplace") | Task 2, Task 3 | ✅ Uses "hub", "shared space", "community" |
| Navigation links wired | Task 5, Task 6 | ✅ Header + Footer |

### Placeholder Scan
- No TBDs, TODOs, or "implement later" markers
- All code blocks are complete and self-contained
- All message keys referenced in the page component are defined in the interface and both language files

### Type Consistency
- Interface keys (`about.why.paragraph1`, `about.offer.items.catalog.title`, etc.) match exactly across `index.ts`, `en.ts`, `ar.ts`, and `page.tsx`
- `useTranslations()` hook usage matches existing pattern from `page.tsx` (Home)
- CSS custom property references match existing design tokens from `globals.css`
