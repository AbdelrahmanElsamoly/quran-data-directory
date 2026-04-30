'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { ResourceForm } from '@/components/dashboard/ResourceForm';
import { ResourceBadge } from '@/components/ui/Badge';
import { useTranslations } from '@/i18n';
import type { Resource, ResourceType } from '@/types/resource';

// Mock user resources for demo
const mockUserResources: Resource[] = [
  {
    id: 100,
    name: 'My Example Library',
    slug: 'my-example-library',
    type: 'library',
    description: 'An example resource published by the current user for demonstration purposes.',
    documentation_url: '',
    github_url: 'https://github.com/example/my-library',
    license: 'MIT',
    itqan_badge: false,
    status: 'published',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-04-10T14:00:00Z',
    version: null,
    github_stats: null,
    total_downloads: 0,
    downloads: 0,
  },
];

export default function DashboardResourcesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations();
  const [isClient, setIsClient] = useState(false);
  const [resources, setResources] = useState<Resource[]>(mockUserResources);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR guard: isClient must be false initially to prevent flash of server-rendered content
    setIsClient(true);
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleCreate = (data: {
    name: string;
    type: ResourceType;
    description: string;
    license: string;
    itqan_badge: boolean;
    github_url: string;
    documentation_url: string;
  }) => {
    // Stub: real backend integration in Session 3
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const newResource: Resource = {
      id: Date.now(),
      ...data,
      slug,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: null,
      github_stats: null,
      total_downloads: 0,
      downloads: 0,
    };
    setResources((prev) => [newResource, ...prev]);
    setShowForm(false);
  };

  const handleEdit = (data: {
    name: string;
    type: ResourceType;
    description: string;
    license: string;
    itqan_badge: boolean;
    github_url: string;
    documentation_url: string;
  }) => {
    if (!editingResource) return;
    // Stub: real PUT/PATCH in Session 3
    setResources((prev) =>
      prev.map((r) =>
        r.id === editingResource.id
          ? { ...r, ...data, updated_at: new Date().toISOString() }
          : r
      )
    );
    setEditingResource(null);
  };

  const handleDelete = (id: number) => {
    // Stub: real DELETE in Session 3
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  if (!isClient || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="skeleton w-32 h-6 rounded" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-grow lg:mr-64">
        {/* Top bar */}
        <div className="bg-[var(--bg-card)] border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
            >
              <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <h1 className="font-heading text-xl font-bold text-[var(--text-primary)]">مواردي</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingResource(null);
              setShowForm(!showForm);
            }}
            className="btn-primary text-sm py-2 px-4"
          >
            + إضافة مورد جديد
          </button>
        </div>

        {/* Content */}
        <div className="section-padding py-8">
          {/* Create/Edit form */}
          {showForm && !editingResource && (
            <div className="mb-8 card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-semibold">إضافة مورد جديد</h2>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  ×
                </button>
              </div>
              <ResourceForm
                onSubmit={handleCreate}
                submitLabel="حفظ المورد"
              />
            </div>
          )}

          {editingResource && (
            <div className="mb-8 card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-semibold">تعديل: {editingResource.name}</h2>
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  ×
                </button>
              </div>
              <ResourceForm
                initial={{
                  name: editingResource.name,
                  type: editingResource.type,
                  description: editingResource.description,
                  license: editingResource.license,
                  itqan_badge: editingResource.itqan_badge,
                  github_url: editingResource.github_url || '',
                  documentation_url: editingResource.documentation_url || '',
                }}
                onSubmit={handleEdit}
                submitLabel="حفظ التعديلات"
              />
            </div>
          )}

          {/* Resource list */}
          <div>
            <h2 className="font-heading text-lg font-semibold mb-4">الموارد المنشورة ({resources.length})</h2>

            {resources.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-[var(--text-muted)] mb-4">لم تقم بنشر أي موارد بعد</p>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="btn-primary text-sm py-2 px-5 inline-block"
                >
                  إضافة أول مورد
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <ResourceBadge type={resource.type} />
                        {resource.itqan_badge && (
                          <span className="badge bg-[var(--accent-gold-light)] text-[var(--accent-gold)] text-xs">
                            ★ Itqan
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          resource.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {resource.status === 'published' ? 'منشور' : 'مسودة'}
                        </span>
                      </div>
                      <h3 className="font-heading font-semibold text-base mb-1">
                        <Link
                          href={`/resources/${resource.slug}`}
                          className="hover:text-[var(--accent-primary)] transition-colors"
                        >
                          {resource.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        {t.catalog.types[resource.type]} · {resource.license}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingResource(resource);
                          setShowForm(false);
                        }}
                        className="btn-outline text-xs py-1.5 px-3"
                      >
                        تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(resource.id)}
                        className="text-xs text-[var(--danger)] hover:underline py-1.5 px-3"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
