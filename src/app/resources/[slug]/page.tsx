import { notFound } from 'next/navigation';
import { mockResources } from '@/lib/mock-data';
import { ResourceDetailClient } from './ResourceDetailClient';

export function generateStaticParams() {
  return mockResources.map((resource) => ({
    slug: resource.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const resource = mockResources.find((r) => r.slug === params.slug);
  if (!resource) return { title: 'Resource Not Found' };

  return {
    title: resource.name,
    description: resource.description.slice(0, 160),
  };
}

export const revalidate = 600; // ISR: revalidate every 10 minutes

export default function ResourceDetailPage({ params }: { params: { slug: string } }) {
  const resource = mockResources.find((r) => r.slug === params.slug);

  if (!resource) {
    notFound();
  }

  return <ResourceDetailClient resource={resource} />;
}
