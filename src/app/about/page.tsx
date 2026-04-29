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
