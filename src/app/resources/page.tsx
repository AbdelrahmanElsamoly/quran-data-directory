import { Suspense } from 'react';
import { CatalogContent } from './CatalogContent';
import { ListSkeleton } from '@/components/ui/Skeleton';

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <CatalogContent />
    </Suspense>
  );
}

function CatalogLoading() {
  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="skeleton h-10 w-48 mb-3" />
          <div className="skeleton h-5 w-96 mb-4" />
          <div className="skeleton h-12 max-w-lg" />
        </div>
        <ListSkeleton count={9} />
      </div>
    </section>
  );
}
