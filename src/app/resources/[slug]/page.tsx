import { notFound } from 'next/navigation';
import { mockResources } from '@/lib/mock-data';
import { ResourceDetailClient } from './ResourceDetailClient';

export function generateStaticParams() {
  return mockResources.map((resource) => ({
    slug: resource.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = mockResources.find((r) => r.slug === slug);
  if (!resource) return { title: 'Resource Not Found' };

  return {
    title: resource.name,
    description: resource.description.slice(0, 160),
  };
}

export const revalidate = 600; // ISR: revalidate every 10 minutes

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = mockResources.find((r) => r.slug === slug);

  if (!resource) {
    notFound();
  }

  return <ResourceDetailClient resource={resource} />;
}
