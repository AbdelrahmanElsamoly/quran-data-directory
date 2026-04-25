'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { RequestCard } from '@/components/dashboard/RequestCard';
import type { AccessRequest } from '@/types/resource';

// Mock recent requests for demo
const mockRecentRequests: AccessRequest[] = [
  {
    id: 101,
    applicant_name: 'user@example.com',
    applicant_display_name: 'أحمد محمد',
    resource_slug: 'quranic-text-toolkit',
    resource_name: 'Quranic Text Toolkit (QTT)',
    status: 'pending',
    message: 'أحتاج هذا المورد لبحثي في تحليل النص القرآني',
    publisher_notes: null,
    created_at: '2026-04-20T10:00:00Z',
    updated_at: '2026-04-20T10:00:00Z',
  },
  {
    id: 102,
    applicant_name: 'dev@test.com',
    applicant_display_name: 'فاطمة علي',
    resource_slug: 'surah-navigator-sdk',
    resource_name: 'Surah Navigator SDK',
    status: 'pending',
    message: 'أعمل على تطبيق قرآني وأحتاج SDK للتنقل بين السور',
    publisher_notes: null,
    created_at: '2026-04-18T14:30:00Z',
    updated_at: '2026-04-18T14:30:00Z',
  },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!isClient || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="skeleton w-32 h-6 rounded" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow lg:mr-64">
        {/* Top bar */}
        <div className="bg-[var(--bg-card)] border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-xl font-bold text-[var(--text-primary)]">لوحة التحكم</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--text-secondary)]">مرحباً، {user.display_name}</span>
            <button
              type="button"
              onClick={logout}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="section-padding py-8">
          {/* Welcome */}
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-2">
              مرحباً بعودتك، {user.display_name}
            </h2>
            <p className="text-[var(--text-secondary)]">إليك ملخص نشاطك على منصة RATQ</p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-muted)]">الموارد المنشورة</span>
                <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">0</p>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-muted)]">طلبات معلقة</span>
                <svg className="w-5 h-5 text-[var(--warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-[var(--warning)]">{mockRecentRequests.length}</p>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-muted)]">مفاتيح API</span>
                <svg className="w-5 h-5 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">0</p>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-muted)]">الدور</span>
                <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-[var(--text-primary)] capitalize">{user.role}</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mb-8">
            <Link
              href="/dashboard/resources"
              className="btn-primary text-sm py-2.5 px-5 inline-block"
            >
              + إضافة مورد جديد
            </Link>
          </div>

          {/* Recent access requests */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">طلبات الوصول الأخيرة</h3>
            {mockRecentRequests.length > 0 ? (
              <div className="space-y-4">
                {mockRecentRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onApprove={(id) => console.log('Approve request', id)}
                    onDeny={(id) => console.log('Deny request', id)}
                  />
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <p className="text-[var(--text-muted)]">لا توجد طلبات وصول معلقة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
