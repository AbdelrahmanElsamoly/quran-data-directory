'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { ResourceForm } from '@/components/dashboard/ResourceForm';
import { ResourceBadge } from '@/components/ui/Badge';
import { useLanguage } from '@/i18n';
import type { Resource, ResourceType } from '@/types/resource';

const mockUserResources: Resource[] = [{ id: 100, name: 'My Example Library', slug: 'my-example-library', type: 'library', description: 'An example resource published by the current user for demonstration purposes.', short_description: 'Example library for demonstration purposes.', documentation_url: '', github_url: 'https://github.com/example/my-library', license: 'MIT', itqan_badge: false, status: 'published', created_at: '2026-03-01T10:00:00Z', updated_at: '2026-04-10T14:00:00Z', version: null, github_stats: null, total_downloads: 0, downloads: 0 }];

export default function DashboardResourcesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t, direction } = useLanguage();
  const copy = t.dashboard.resources;
  const [isClient, setIsClient] = useState(false);
  const [resources, setResources] = useState<Resource[]>(mockUserResources);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  useEffect(() => { setIsClient(true); if (!user) router.push('/login'); }, [user, router]);
  const handleCreate = (data: { name: string; type: ResourceType; short_description: string; description: string; license: string; itqan_badge: boolean; github_url: string; documentation_url: string; }) => { const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''); const newResource: Resource = { id: Date.now(), ...data, slug, status: 'draft', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), version: null, github_stats: null, total_downloads: 0, downloads: 0 }; setResources((prev) => [newResource, ...prev]); setShowForm(false); };
  const handleEdit = (data: { name: string; type: ResourceType; short_description: string; description: string; license: string; itqan_badge: boolean; github_url: string; documentation_url: string; }) => { if (!editingResource) return; setResources((prev) => prev.map((resource) => resource.id === editingResource.id ? { ...resource, ...data, updated_at: new Date().toISOString() } : resource)); setEditingResource(null); };
  const handleDelete = (id: number) => setResources((prev) => prev.filter((resource) => resource.id !== id));
  if (!isClient || !user) return <div className="flex min-h-[60vh] items-center justify-center bg-white"><div className="h-6 w-32 animate-pulse rounded bg-[#ededed]" /></div>;
  const isFormOpen = showForm || Boolean(editingResource);
  return (
    <div className="min-h-screen bg-white text-black" dir={direction}>
      <Sidebar />
      <div className="pt-32 lg:mx-72">
        <main className="mx-auto max-w-[1180px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="rounded-2xl bg-[linear-gradient(122.15deg,#EAF4ED_30.7%,#CFE7D8_86.27%)] p-6 text-center sm:p-8"><span className="inline-flex rounded-full bg-[#e8ef3d] px-4 py-2 text-sm font-black text-black">{copy.badge}</span><h1 className="mt-5 text-3xl font-black leading-tight text-black sm:text-4xl">{copy.title}</h1><p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#59636d]">{copy.subtitle}</p></div><aside className="rounded-lg bg-[#171717] p-6 text-white"><p className="text-sm font-black text-[#e8ef3d]">{copy.quickAction}</p><button type="button" onClick={() => { setEditingResource(null); setShowForm((value) => !value); }} className="mt-5 h-11 w-full rounded-full bg-white px-5 text-sm font-black text-black transition hover:bg-[#e8ef3d]">{showForm ? copy.closeForm : copy.addResource}</button></aside></section>
        {isFormOpen && <section className="mt-7 rounded-lg border border-[#ededed] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.035)]"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-black text-black">{editingResource ? `Edit: ${editingResource.name}` : 'Add resource'}</h2><button type="button" onClick={() => { setShowForm(false); setEditingResource(null); }} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fafafa] text-[#6f7780] transition hover:bg-[#ededed]">x</button></div><ResourceForm initial={editingResource ? { name: editingResource.name, type: editingResource.type, short_description: editingResource.short_description, description: editingResource.description, license: editingResource.license, itqan_badge: editingResource.itqan_badge, github_url: editingResource.github_url || '', documentation_url: editingResource.documentation_url || '' } : undefined} onSubmit={editingResource ? handleEdit : handleCreate} submitLabel={editingResource ? t.dashboard.common.saveChanges : copy.saveResource} /></section>}
        <section className="mt-7"><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-black text-black">{copy.publishedResources.replace('{{count}}', String(resources.length))}</h2><p className="mt-2 text-sm leading-6 text-[#6f7780]">{copy.description}</p></div><Link href="/resources" className="text-sm font-black text-[#171717] transition hover:text-black">{copy.viewCatalog}</Link></div>{resources.length === 0 ? <div className="rounded-lg border border-[#ededed] bg-[#fafafa] p-8 text-center"><p className="mb-5 text-sm font-bold text-[#8b949e]">{copy.empty}</p><button type="button" onClick={() => setShowForm(true)} className="h-10 rounded-full bg-black px-5 text-sm font-black text-white">{copy.addFirst}</button></div> : <div className="grid gap-4">{resources.map((resource) => <article key={resource.id} className="rounded-lg border border-[#ededed] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.035)]"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="min-w-0 flex-1"><div className="mb-3 flex flex-wrap items-center gap-2"><ResourceBadge type={resource.type} />{resource.itqan_badge && <span className="rounded-full bg-[#fff7e6] px-3 py-1 text-xs font-black text-[#9a5a00]">Itqan</span>}<span className={`rounded-full px-3 py-1 text-xs font-black ${resource.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{resource.status === 'published' ? t.dashboard.common.published : t.dashboard.common.draft}</span></div><h3 className="truncate text-lg font-black text-black"><Link href={`/resources/${resource.slug}`} className="transition hover:text-[#171717]">{resource.name}</Link></h3><p className="mt-2 text-sm font-bold text-[#8b949e]">{t.catalog.types[resource.type]} - {resource.license}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => { setEditingResource(resource); setShowForm(false); }} className="h-9 rounded-full border border-[#171717] px-4 text-xs font-black text-[#171717] transition hover:bg-[#171717] hover:text-white">{t.dashboard.common.edit}</button><button type="button" onClick={() => handleDelete(resource.id)} className="h-9 rounded-full border border-red-200 px-4 text-xs font-black text-red-700 transition hover:bg-red-50">{t.dashboard.common.delete}</button></div></div></article>)}</div>}</section>
        </main>
      </div>
    </div>
  );
}